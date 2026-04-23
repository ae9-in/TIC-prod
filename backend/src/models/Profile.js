const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema(
  {
    institution: { type: String, default: "" },
    degree: { type: String, default: "" },
    fieldOfStudy: { type: String, default: "" },
    startYear: { type: String, default: "" },
    endYear: { type: String, default: "" },
  },
  { _id: false },
);

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, default: "" },
    role: { type: String, default: "" },
    duration: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false },
);

const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    fullName: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    bio: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    role: { type: String, enum: ["candidate", "admin"], default: "candidate" },
    skills: { type: [String], default: [] },
    certificates: { type: [String], default: [] },
    educations: { type: [educationSchema], default: [] },
    experiences: { type: [experienceSchema], default: [] },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Profile", profileSchema);
