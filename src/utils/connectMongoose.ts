import mongoose from "mongoose";

import { ApiError } from "@/utils/apiError";


// Caches connection to improve performance
type Cached = { conn: typeof mongoose | null, promise: Promise<typeof mongoose> | null };
let cached: Cached | null = null;

export default async function connectMongoose() {
  cached ??= { conn: null, promise: null };
  if (cached.conn) return cached.conn;

  const MONGODB_URI = process.env.LOOP_MONGODB_URI;
  if (!MONGODB_URI) throw new ApiError(500, "Failed to connect to database: Missing MongoDB uri");

  if (!cached.promise) {
    cached.promise = mongoose
      .set("strictQuery", false)
      .connect(MONGODB_URI)
      .then(mongoose => mongoose);
  }

  try {
    cached.conn = await cached.promise;
  }
  catch {
    cached.promise = null
    throw new ApiError(500, "Failed to connect to database");
  }

  return cached.conn;
}