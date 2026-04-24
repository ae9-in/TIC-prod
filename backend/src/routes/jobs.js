const express = require("express");
const Job = require("../models/Job");
const { authRequired, adminRequired } = require("../middleware/auth");

const router = express.Router();

const toJob = (job) => ({
  id: job._id.toString(),
  createdBy: job.createdBy?.toString?.() || job.createdBy,
  title: job.title,
  company: job.company,
  location: job.location || "",
  employmentType: job.employmentType,
  description: job.description,
  requirements: job.requirements || [],
  skills: job.skills || [],
  stipendMin: job.stipendMin,
  stipendMax: job.stipendMax,
  deadline: job.deadline,
  status: job.status,
  createdAt: job.createdAt,
  updatedAt: job.updatedAt,
});

router.get("", authRequired, async (req, res) => {
  let query;
  if (req.user.role === "admin") {
    const mine = String(req.query.mine || "true") !== "false";
    query = mine ? { createdBy: req.user.id } : {};
  } else {
    query = { status: "published", $or: [{ deadline: null }, { deadline: { $gte: new Date() } }] };
  }
  const jobs = await Job.find(query).sort({ createdAt: -1 }).lean();
  return res.json({ jobs: jobs.map(toJob) });
});

router.get("/:jobId", authRequired, async (req, res) => {
  const job = await Job.findById(req.params.jobId).lean();
  if (!job) return res.status(404).json({ message: "Job not found" });

  if (
    req.user.role !== "admin" &&
    (job.status !== "published" || (job.deadline && new Date(job.deadline) < new Date()))
  ) {
    return res.status(404).json({ message: "Job not available" });
  }

  return res.json({ job: toJob(job) });
});

router.post("", authRequired, adminRequired, async (req, res) => {
  const payload = {
    createdBy: req.user.id,
    title: req.body.title,
    company: req.body.company,
    location: req.body.location || "",
    employmentType: req.body.employmentType || "internship",
    description: req.body.description || "",
    requirements: Array.isArray(req.body.requirements) ? req.body.requirements : [],
    skills: Array.isArray(req.body.skills) ? req.body.skills : [],
    stipendMin: req.body.stipendMin ?? null,
    stipendMax: req.body.stipendMax ?? null,
    deadline: req.body.deadline ? new Date(req.body.deadline) : null,
    status: req.body.status || "draft",
  };

  if (!payload.title || !payload.company || !payload.description) {
    return res.status(400).json({ message: "Title, company, and description are required" });
  }

  const job = await Job.create(payload);
  return res.status(201).json({ job: toJob(job) });
});

router.put("/:jobId", authRequired, adminRequired, async (req, res) => {
  const existing = await Job.findById(req.params.jobId).lean();
  if (!existing) return res.status(404).json({ message: "Job not found" });
  if (String(existing.createdBy) !== req.user.id) {
    return res.status(403).json({ message: "You can only update jobs created by your account" });
  }

  const payload = {
    title: req.body.title,
    company: req.body.company,
    location: req.body.location,
    employmentType: req.body.employmentType,
    description: req.body.description,
    requirements: Array.isArray(req.body.requirements) ? req.body.requirements : [],
    skills: Array.isArray(req.body.skills) ? req.body.skills : [],
    stipendMin: req.body.stipendMin ?? null,
    stipendMax: req.body.stipendMax ?? null,
    deadline: req.body.deadline ? new Date(req.body.deadline) : null,
    status: req.body.status,
  };

  const job = await Job.findByIdAndUpdate(req.params.jobId, payload, { new: true }).lean();
  return res.json({ job: toJob(job) });
});

router.delete("/:jobId", authRequired, adminRequired, async (req, res) => {
  const existing = await Job.findById(req.params.jobId).lean();
  if (!existing) return res.status(404).json({ message: "Job not found" });
  if (String(existing.createdBy) !== req.user.id) {
    return res.status(403).json({ message: "You can only delete jobs created by your account" });
  }

  await Job.findByIdAndDelete(req.params.jobId);
  return res.json({ ok: true });
});

module.exports = router;
