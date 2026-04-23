const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

const authRequired = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = header.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).lean();
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    req.user = { id: user._id.toString(), email: user.email, role: user.role };
    req.token = token;
    return next();
  } catch (_err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const adminRequired = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  return next();
};

module.exports = {
  authRequired,
  adminRequired,
  JWT_SECRET,
};
