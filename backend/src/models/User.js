const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["candidate", "admin"], default: "candidate" },
    resetPasswordTokenHash: { type: String, default: null },
    resetPasswordExpiresAt: { type: Date, default: null },
  },
  { timestamps: true },
);

userSchema.index(
  { resetPasswordTokenHash: 1, resetPasswordExpiresAt: 1 },
  { partialFilterExpression: { resetPasswordTokenHash: { $exists: true, $ne: null } } },
);

module.exports = mongoose.model("User", userSchema);
