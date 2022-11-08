
import { Loader } from "@googlemaps/js-api-loader";

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
  version: "weekly",
  libraries: ["geometry"]
});

export default loader.load();
