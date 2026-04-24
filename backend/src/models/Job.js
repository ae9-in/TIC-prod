const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, default: "" },
    employmentType: {
      type: String,
      enum: ["internship", "full-time", "part-time", "contract", "remote", "hybrid"],
      default: "internship",
    },
    description: { type: String, required: true },
    requirements: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    stipendMin: { type: Number, default: null },
    stipendMax: { type: Number, default: null },
    deadline: { type: Date, default: null },
    status: { type: String, enum: ["draft", "published", "closed"], default: "draft" },
  },
  { timestamps: true },
);

jobSchema.index({ createdBy: 1, createdAt: -1 });
jobSchema.index({ status: 1, createdAt: -1, deadline: 1 });

module.exports = mongoose.model("Job", jobSchema);
