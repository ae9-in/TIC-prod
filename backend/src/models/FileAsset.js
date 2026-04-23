const mongoose = require("mongoose");

const fileAssetSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    kind: { type: String, enum: ["avatar", "resume"], required: true },
    originalName: { type: String, default: "" },
    mimeType: { type: String, default: "application/octet-stream" },
    data: { type: Buffer, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("FileAsset", fileAssetSchema);

