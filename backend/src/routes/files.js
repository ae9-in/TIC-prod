const express = require("express");
const mongoose = require("mongoose");
const FileAsset = require("../models/FileAsset");

const router = express.Router();

router.get("/files/:fileId", async (req, res) => {
  const { fileId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(fileId)) {
    return res.status(404).json({ message: "File not found" });
  }

  const file = await FileAsset.findById(fileId).lean();
  if (!file) {
    return res.status(404).json({ message: "File not found" });
  }

  res.setHeader("Content-Type", file.mimeType || "application/octet-stream");
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  return res.send(file.data);
});

module.exports = router;

