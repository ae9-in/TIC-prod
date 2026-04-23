const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { authRequired } = require("../middleware/auth");

const router = express.Router();

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const uploadDir = path.join(process.cwd(), "backend", "uploads");
const avatarDir = path.join(uploadDir, "avatars");
const resumeDir = path.join(uploadDir, "resumes");
ensureDir(avatarDir);
ensureDir(resumeDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.params.kind === "resume" ? resumeDir : avatarDir;
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    cb(null, `${req.user.id}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post("/:kind(avatar|resume)", authRequired, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  const kindFolder = req.params.kind === "resume" ? "resumes" : "avatars";
  const fileUrl = `/uploads/${kindFolder}/${req.file.filename}`;
  return res.status(201).json({ fileUrl });
});

module.exports = router;
