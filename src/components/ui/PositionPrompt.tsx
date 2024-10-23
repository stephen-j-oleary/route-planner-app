import NextLink from "next/link";

import { Alert, Button } from "@mui/material";

import useGeolocation from "@/hooks/useGeolocation";
import pages from "pages";


export default function PositionPrompt() {
  const geolocation = useGeolocation();

  if (["loading", "granted"].includes(geolocation.state)) return null;

  return (
    <Alert
      severity="info"
      action={
        geolocation.state === "prompt"
          ? <Button onClick={() => geolocation.request()}>Allow</Button>
          : <Button component={NextLink} href={pages.enableLocation} target="_blank">Allow</Button>
      }
    >
      Allow location access to get more accurate address and place suggestions
    </Alert>
  );
}