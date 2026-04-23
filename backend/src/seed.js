const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("./models/User");
const Profile = require("./models/Profile");
const Job = require("./models/Job");
const Application = require("./models/Application");

dotenv.config({ path: "./.env" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI in backend/.env");
  process.exit(1);
}

const adminEmail = (process.env.ADMIN_EMAIL || "admin@talentscout.com").toLowerCase();
const adminPassword = process.env.SEED_ADMIN_PASSWORD || "password123";
const candidatePassword = process.env.SEED_CANDIDATE_PASSWORD || "password123";

const candidates = [
  {
    email: "candidate1@internlink.com",
    fullName: "Ananya Sharma",
    phone: "+91 98765 43210",
    bio: "Frontend-focused candidate passionate about React and UI systems.",
    skills: ["React", "TypeScript", "Tailwind CSS", "Figma"],
    certificates: ["Meta Front-End", "Google UX"],
    educations: [
      {
        institution: "IIT Hyderabad",
        degree: "B.Tech",
        fieldOfStudy: "Computer Science",
        startYear: "2022",
        endYear: "2026",
      },
    ],
    experiences: [
      {
        company: "PixelFlow Labs",
        role: "Frontend Intern",
        duration: "Jan 2026 - Mar 2026",
        description: "Built reusable UI components and improved Lighthouse performance by 18%.",
      },
    ],
  },
  {
    email: "candidate2@internlink.com",
    fullName: "Rohan Mehta",
    phone: "+91 91234 56789",
    bio: "Backend and data enthusiast with strong Node.js and MongoDB foundations.",
    skills: ["Node.js", "Express", "MongoDB", "REST APIs"],
    certificates: ["MongoDB Associate Developer"],
    educations: [
      {
        institution: "NIT Warangal",
        degree: "B.Tech",
        fieldOfStudy: "Information Technology",
        startYear: "2021",
        endYear: "2025",
      },
    ],
    experiences: [
      {
        company: "DataBridge Systems",
        role: "Backend Intern",
        duration: "Jun 2025 - Aug 2025",
        description: "Developed secure API endpoints and optimized query performance for analytics dashboards.",
      },
    ],
  },
];

const jobsSeed = [
  {
    title: "Frontend Developer Intern",
    company: "InternLink Labs",
    location: "Hyderabad",
    employmentType: "internship",
    description: "Work with the product team to build candidate-facing interfaces with React and Tailwind.",
    requirements: ["Strong React basics", "Understanding of component architecture"],
    skills: ["React", "TypeScript", "Tailwind"],
    stipendMin: 15000,
    stipendMax: 25000,
    status: "published",
    deadlineDays: 30,
  },
  {
    title: "Backend API Intern",
    company: "InternLink Labs",
    location: "Remote",
    employmentType: "internship",
    description: "Build and maintain REST APIs, data models, and auth flows for our hiring platform.",
    requirements: ["Node.js knowledge", "Database fundamentals"],
    skills: ["Node.js", "Express", "MongoDB"],
    stipendMin: 18000,
    stipendMax: 30000,
    status: "published",
    deadlineDays: 45,
  },
  {
    title: "QA Automation Intern",
    company: "InternLink Labs",
    location: "Bengaluru",
    employmentType: "internship",
    description: "Create automated tests for core user journeys and support release confidence.",
    requirements: ["Basic testing knowledge", "Attention to detail"],
    skills: ["Testing", "Playwright", "CI"],
    stipendMin: 12000,
    stipendMax: 22000,
    status: "draft",
    deadlineDays: 60,
  },
];

(async () => {
  try {
    await mongoose.connect(MONGODB_URI);

    const userHashAdmin = await bcrypt.hash(adminPassword, 10);
    const userHashCandidate = await bcrypt.hash(candidatePassword, 10);

    const adminUser = await User.findOneAndUpdate(
      { email: adminEmail },
      { email: adminEmail, passwordHash: userHashAdmin, role: "admin" },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    await Profile.findOneAndUpdate(
      { userId: adminUser._id },
      {
        userId: adminUser._id,
        email: adminEmail,
        role: "admin",
        fullName: "Platform Admin",
        phone: "+91 90000 00000",
        bio: "Administrator account",
        skills: ["Hiring", "Operations"],
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    const candidateUsers = [];
    for (const c of candidates) {
      const candidateUser = await User.findOneAndUpdate(
        { email: c.email.toLowerCase() },
        { email: c.email.toLowerCase(), passwordHash: userHashCandidate, role: "candidate" },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );

      await Profile.findOneAndUpdate(
        { userId: candidateUser._id },
        {
          userId: candidateUser._id,
          email: c.email.toLowerCase(),
          role: "candidate",
          fullName: c.fullName,
          phone: c.phone,
          bio: c.bio,
          skills: c.skills,
          certificates: c.certificates,
          educations: c.educations,
          experiences: c.experiences,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );

      candidateUsers.push(candidateUser);
    }

    const jobs = [];
    for (const j of jobsSeed) {
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + j.deadlineDays);

      const job = await Job.findOneAndUpdate(
        { title: j.title, company: j.company },
        {
          createdBy: adminUser._id,
          title: j.title,
          company: j.company,
          location: j.location,
          employmentType: j.employmentType,
          description: j.description,
          requirements: j.requirements,
          skills: j.skills,
          stipendMin: j.stipendMin,
          stipendMax: j.stipendMax,
          status: j.status,
          deadline,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );

      jobs.push(job);
    }

    const publishedJobs = jobs.filter((j) => j.status === "published");

    for (let i = 0; i < Math.min(candidateUsers.length, publishedJobs.length); i += 1) {
      const candidate = candidateUsers[i];
      const profile = await Profile.findOne({ userId: candidate._id }).lean();
      const job = publishedJobs[i];

      await Application.findOneAndUpdate(
        { jobId: job._id, userId: candidate._id },
        {
          jobId: job._id,
          userId: candidate._id,
          profileId: profile?._id || null,
          coverLetter: `I am excited to apply for ${job.title} and contribute from day one.`,
          resumeUrl: profile?.resumeUrl || "",
          applicationStatus: i === 0 ? "shortlisted" : "submitted",
          appliedAt: new Date(),
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }

    const [usersCount, profilesCount, jobsCount, applicationsCount] = await Promise.all([
      User.countDocuments(),
      Profile.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments(),
    ]);

    console.log("Seed completed successfully.");
    console.log(`users: ${usersCount}`);
    console.log(`profiles: ${profilesCount}`);
    console.log(`jobs: ${jobsCount}`);
    console.log(`applications: ${applicationsCount}`);
    console.log(`admin login: ${adminEmail} / ${adminPassword}`);
    console.log(`candidate login: candidate1@internlink.com / ${candidatePassword}`);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
