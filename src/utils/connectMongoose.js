import mongoose from "mongoose";


const MONGODB_URI = process.env.LOOP_MONGODB_URI

// Caches connection to improve performance
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export default async function connectMongoose() {
  if (!MONGODB_URI) throw new Error("Invalid environment");
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .set("strictQuery", false)
      .connect(MONGODB_URI)
      .then(mongoose => mongoose);
  }

  try {
    cached.conn = await cached.promise;
  }
  catch (err) {
    cached.promise = null
    throw err;
  }

  return cached.conn;
}