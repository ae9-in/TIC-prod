const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const Profile = require("../models/Profile");
const { authRequired, JWT_SECRET } = require("../middleware/auth");

const router = express.Router();
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@talentscout.com").toLowerCase();
const RESET_PASSWORD_TOKEN_TTL_MS = Number(process.env.RESET_PASSWORD_TOKEN_TTL_MS || 15 * 60 * 1000);
const RESET_PASSWORD_URL =
  process.env.RESET_PASSWORD_URL || `${process.env.CLIENT_ORIGIN || "http://localhost:8080"}/auth`;

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

router.post("/forgot-password", async (req, res) => {
  try {
    const email = String(req.body.email || "").toLowerCase().trim();
    const genericMessage = "If an account exists for this email, a reset link has been generated.";
    if (!email) return res.status(200).json({ message: genericMessage });

    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: genericMessage });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
    const resetPasswordExpiresAt = new Date(Date.now() + RESET_PASSWORD_TOKEN_TTL_MS);

    user.resetPasswordTokenHash = resetPasswordTokenHash;
    user.resetPasswordExpiresAt = resetPasswordExpiresAt;
    await user.save();

    const resetLink = `${RESET_PASSWORD_URL}?token=${encodeURIComponent(resetToken)}`;
    console.log(`[auth] Password reset link for ${email}: ${resetLink}`);

    return res.json({ message: genericMessage });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Could not process password reset request" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const token = String(req.body.token || "").trim();
    const password = String(req.body.password || "");
    if (!token || !password || password.length < 6) {
      return res.status(400).json({ message: "Valid token and password (min 6 chars) are required" });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpiresAt: { $gt: new Date() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired reset token" });

    user.passwordHash = await bcrypt.hash(password, 10);
    user.resetPasswordTokenHash = null;
    user.resetPasswordExpiresAt = null;
    await user.save();

    return res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Could not reset password" });
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
