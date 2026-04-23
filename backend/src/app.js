const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDatabase } = require("./db");

dotenv.config();

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profiles");
const jobRoutes = require("./routes/jobs");
const appRoutes = require("./routes/applications");
const uploadRoutes = require("./routes/uploads");
const fileRoutes = require("./routes/files");

const app = express();

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:8080";
const allowedOrigins = CLIENT_ORIGIN.split(",").map((v) => v.trim()).filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(async (_req, _res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    next(error);
  }
});

app.get("/", (_req, res) => {
  res.json({ ok: true, service: "tic-prod-backend" });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api", appRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api", fileRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  if (err?.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "CORS blocked request origin" });
  }
  return res.status(500).json({ message: "Internal server error" });
});

module.exports = app;

