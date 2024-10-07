import NextLink from "next/link";

import { Alert, Button } from "@mui/material";

import usePosition from "@/hooks/usePosition";
import pages from "pages";

export default function PositionPrompt() {
  const position = usePosition();

  if (position.status === "loading" || position.status === "granted") return null;

  return (
    <Alert
      severity="info"
      action={
        position.status === "prompt"
          ? <Button onClick={() => position.request()}>Allow</Button>
          : <Button component={NextLink} href={pages.enableLocation} target="_blank">Allow</Button>
      }
    >
      Allow location access to get more accurate address and place suggestions
    </Alert>
  );
}