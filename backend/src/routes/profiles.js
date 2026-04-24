const express = require("express");
const Profile = require("../models/Profile");
const { authRequired, adminRequired } = require("../middleware/auth");

const router = express.Router();

const toProfileResponse = (profile) => ({
  id: profile._id.toString(),
  userId: profile.userId.toString(),
  fullName: profile.fullName || "",
  email: profile.email || "",
  phone: profile.phone || "",
  bio: profile.bio || "",
  avatarUrl: profile.avatarUrl || "",
  resumeUrl: profile.resumeUrl || "",
  role: profile.role || "candidate",
  skills: profile.skills || [],
  certificates: profile.certificates || [],
  educations: profile.educations || [],
  experiences: profile.experiences || [],
  createdAt: profile.createdAt,
  updatedAt: profile.updatedAt,
});

router.get("/me", authRequired, async (req, res) => {
  const profile = await Profile.findOne({ userId: req.user.id })
    .select("userId fullName email phone bio avatarUrl resumeUrl role skills certificates educations experiences createdAt updatedAt")
    .lean();
  if (!profile) return res.status(404).json({ message: "Profile not found" });
  return res.json({ profile: toProfileResponse(profile) });
});

router.put("/me", authRequired, async (req, res) => {
  const payload = {
    fullName: req.body.fullName || "",
    email: req.body.email || req.user.email,
    phone: req.body.phone || "",
    bio: req.body.bio || "",
    avatarUrl: req.body.avatarUrl || "",
    resumeUrl: req.body.resumeUrl || "",
    skills: Array.isArray(req.body.skills) ? req.body.skills : [],
    certificates: Array.isArray(req.body.certificates) ? req.body.certificates : [],
    educations: Array.isArray(req.body.educations) ? req.body.educations : [],
    experiences: Array.isArray(req.body.experiences) ? req.body.experiences : [],
  };

  const profile = await Profile.findOneAndUpdate({ userId: req.user.id }, payload, {
    new: true,
    upsert: true,
  }).lean();

  return res.json({ profile: toProfileResponse(profile) });
});

router.get("", authRequired, adminRequired, async (_req, res) => {
  const profiles = await Profile.find({ role: { $ne: "admin" } })
    .select("userId fullName email phone bio avatarUrl resumeUrl role skills certificates educations experiences createdAt updatedAt")
    .sort({ createdAt: -1 })
    .lean();
  return res.json({ profiles: profiles.map(toProfileResponse) });
});

router.get("/:profileId", authRequired, adminRequired, async (req, res) => {
  const profile = await Profile.findById(req.params.profileId)
    .select("userId fullName email phone bio avatarUrl resumeUrl role skills certificates educations experiences createdAt updatedAt")
    .lean();
  if (!profile) return res.status(404).json({ message: "Profile not found" });
  return res.json({ profile: toProfileResponse(profile) });
});

module.exports = router;
