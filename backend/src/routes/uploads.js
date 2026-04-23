const express = require("express");
const multer = require("multer");
const { authRequired } = require("../middleware/auth");
const FileAsset = require("../models/FileAsset");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/:kind(avatar|resume)", authRequired, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const asset = await FileAsset.create({
    ownerId: req.user.id,
    kind: req.params.kind,
    originalName: req.file.originalname || "",
    mimeType: req.file.mimetype || "application/octet-stream",
    data: req.file.buffer,
  });

  return res.status(201).json({ fileUrl: `/api/files/${asset._id}` });
});

module.exports = router;
