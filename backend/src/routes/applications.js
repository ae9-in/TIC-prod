const express = require("express");
const Application = require("../models/Application");
const Job = require("../models/Job");
const Profile = require("../models/Profile");
const { authRequired, adminRequired } = require("../middleware/auth");

const router = express.Router();

const toApplication = (app) => ({
  id: app._id.toString(),
  jobId: app.jobId?.toString?.() || app.jobId,
  userId: app.userId?.toString?.() || app.userId,
  profileId: app.profileId?.toString?.() || app.profileId,
  coverLetter: app.coverLetter || "",
  resumeUrl: app.resumeUrl || "",
  applicationStatus: app.applicationStatus,
  appliedAt: app.appliedAt,
  createdAt: app.createdAt,
  updatedAt: app.updatedAt,
});

router.post("/jobs/:jobId/apply", authRequired, async (req, res) => {
  if (req.user.role === "admin") {
    return res.status(403).json({ message: "Admin accounts cannot apply" });
  }

  const job = await Job.findById(req.params.jobId).lean();
  if (!job || job.status !== "published" || (job.deadline && new Date(job.deadline) < new Date())) {
    return res.status(400).json({ message: "Job is not accepting applications" });
  }

  const profile = await Profile.findOne({ userId: req.user.id }).lean();

  try {
    const app = await Application.create({
      jobId: job._id,
      userId: req.user.id,
      profileId: profile?._id || null,
      coverLetter: req.body.coverLetter || "",
      resumeUrl: req.body.resumeUrl || profile?.resumeUrl || "",
    });

    return res.status(201).json({ application: toApplication(app) });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "Already applied to this job" });
    }
    return res.status(500).json({ message: "Failed to apply" });
  }
});

router.get("/applications/me", authRequired, async (req, res) => {
  const applications = await Application.find({ userId: req.user.id }).sort({ appliedAt: -1 }).lean();
  const jobIds = applications.map((a) => a.jobId);
  const jobs = await Job.find({ _id: { $in: jobIds } }).lean();
  const jobMap = new Map(jobs.map((j) => [j._id.toString(), j]));

  const enriched = applications.map((app) => {
    const job = jobMap.get(String(app.jobId));
    return {
      ...toApplication(app),
      job: job
        ? {
            id: job._id.toString(),
            title: job.title,
            company: job.company,
            location: job.location,
            deadline: job.deadline,
            status: job.status,
          }
        : null,
    };
  });

  return res.json({ applications: enriched });
});

router.get("/applications", authRequired, adminRequired, async (req, res) => {
  const filterJobId = String(req.query.jobId || "");
  const adminJobs = await Job.find({ createdBy: req.user.id }).select("_id").lean();
  const adminJobIds = adminJobs.map((j) => j._id.toString());

  if (adminJobIds.length === 0) {
    return res.json({ applications: [] });
  }

  const query = filterJobId
    ? { jobId: { $in: adminJobIds.filter((id) => id === filterJobId) } }
    : { jobId: { $in: adminJobIds } };

  const applications = await Application.find(query).sort({ appliedAt: -1 }).lean();
  const jobIds = applications.map((a) => a.jobId);
  const userIds = applications.map((a) => a.userId);

  const [jobs, profiles] = await Promise.all([
    Job.find({ _id: { $in: jobIds } }).lean(),
    Profile.find({ userId: { $in: userIds } }).lean(),
  ]);

  const jobMap = new Map(jobs.map((j) => [j._id.toString(), j]));
  const profileMap = new Map(profiles.map((p) => [p.userId.toString(), p]));

  const enriched = applications.map((app) => {
    const profile = profileMap.get(String(app.userId));
    const job = jobMap.get(String(app.jobId));

    return {
      ...toApplication(app),
      candidate: profile
        ? {
            profileId: profile._id.toString(),
            fullName: profile.fullName,
            email: profile.email,
          }
        : null,
      job: job
        ? {
            id: job._id.toString(),
            title: job.title,
            company: job.company,
          }
        : null,
    };
  });

  return res.json({ applications: enriched });
});

router.patch("/applications/:applicationId/status", authRequired, adminRequired, async (req, res) => {
  const valid = ["submitted", "shortlisted", "rejected", "accepted"];
  const next = String(req.body.applicationStatus || "");
  if (!valid.includes(next)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const existing = await Application.findById(req.params.applicationId).lean();
  if (!existing) return res.status(404).json({ message: "Application not found" });

  const job = await Job.findById(existing.jobId).lean();
  if (!job || String(job.createdBy) !== req.user.id) {
    return res.status(403).json({ message: "You can only update applications for your jobs" });
  }

  const app = await Application.findByIdAndUpdate(req.params.applicationId, { applicationStatus: next }, { new: true }).lean();
  if (!app) return res.status(404).json({ message: "Application not found" });
  return res.json({ application: toApplication(app) });
});

module.exports = router;
