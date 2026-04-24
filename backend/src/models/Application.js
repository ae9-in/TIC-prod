const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", default: null },
    coverLetter: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    applicationStatus: {
      type: String,
      enum: ["submitted", "shortlisted", "rejected", "accepted"],
      default: "submitted",
    },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

applicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });
applicationSchema.index({ userId: 1, appliedAt: -1 });
applicationSchema.index({ jobId: 1, appliedAt: -1 });

module.exports = mongoose.model("Application", applicationSchema);
