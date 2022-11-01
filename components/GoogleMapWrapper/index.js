
import { Wrapper } from "@googlemaps/react-wrapper";

export default function GoogleMapWrapper({ render }) {
  return (
    <Wrapper
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
      libraries={["places"]}
      render={render}
    />
  );
}
