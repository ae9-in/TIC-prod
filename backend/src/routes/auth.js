const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Profile = require("../models/Profile");
const { authRequired, JWT_SECRET } = require("../middleware/auth");

const router = express.Router();
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@talentscout.com").toLowerCase();

const userPayload = (user, profile) => ({
  id: user._id.toString(),
  email: user.email,
  role: user.role,
  profileId: profile?._id?.toString() || null,
});

router.post("/signup", async (req, res) => {
  try {
    const email = String(req.body.email || "").toLowerCase().trim();
    const password = String(req.body.password || "");

    if (!email || !password || password.length < 6) {
      return res.status(400).json({ message: "Valid email and password (min 6 chars) are required" });
    }

    const existing = await User.findOne({ email }).lean();
    if (existing) return res.status(409).json({ message: "Account already exists" });

    const role = email === ADMIN_EMAIL ? "admin" : "candidate";
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({ email, passwordHash, role });
    const profile = await Profile.create({
      userId: user._id,
      email,
      role,
      fullName: "",
      phone: "",
      bio: "",
    });

    const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, { expiresIn: "7d" });

    return res.status(201).json({ token, user: userPayload(user, profile) });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Signup failed" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const email = String(req.body.email || "").toLowerCase().trim();
    const password = String(req.body.password || "");

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const profile = await Profile.findOne({ userId: user._id }).lean();
    const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, { expiresIn: "7d" });

    return res.json({ token, user: userPayload(user, profile) });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Signin failed" });
  }
});

router.get("/me", authRequired, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    const profile = await Profile.findOne({ userId: user._id }).lean();
    return res.json({ user: userPayload(user, profile) });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Could not load session" });
  }
});

module.exports = router;
