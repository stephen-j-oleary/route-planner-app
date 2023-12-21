import { Loader } from "@googlemaps/js-api-loader";


let cached = global.googleMapsApi;
if (!cached) cached = global.googleMapsApi = { conn: null, promise: null };

export default async function connectGoogleMapsApi() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
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