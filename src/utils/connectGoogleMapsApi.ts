import { Loader } from "@googlemaps/js-api-loader";


type Cached = { conn: Awaited<ReturnType<Loader["load"]>> | null, promise: ReturnType<Loader["load"]> | null };
let cached: Cached | null = null;

export default async function connectGoogleMapsApi() {
  cached ??= { conn: null, promise: null };
  if (cached.conn) return cached.conn;

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  if (!API_KEY) throw new Error("Missing Google api key");

  if (!cached.promise) {
    const loader = new Loader({
      apiKey: API_KEY,
      version: "weekly",
      libraries: ["geometry"]
    });

    cached.promise = loader.load();
  }

  try {
    cached.conn = await cached.promise;
  }
  catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}