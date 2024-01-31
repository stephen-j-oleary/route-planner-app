import mongoose from "mongoose";


// Caches connection to improve performance
type Cached = { conn: typeof mongoose | null, promise: Promise<typeof mongoose> | null };
let cached: Cached | null = null;

export default async function connectMongoose() {
  cached ??= { conn: null, promise: null };
  if (cached.conn) return cached.conn;

  const MONGODB_URI = process.env.LOOP_MONGODB_URI
  if (!MONGODB_URI) throw new Error("Missing MongoDB uri");

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