import mongoose from "mongoose";


// Caches connection in local development. Prevents new connections on every hot reload
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export default async function connectMongoose() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .set("strictQuery", false)
      .connect(process.env.MONGO_URI)
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