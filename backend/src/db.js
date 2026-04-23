const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI in environment");
}

let cached = global.__mongoose_cache;

if (!cached) {
  cached = global.__mongoose_cache = { conn: null, promise: null };
}

async function connectDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongooseInstance) => mongooseInstance);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = {
  connectDatabase,
};

