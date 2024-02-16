import NextLink from "next/link";

import { Alert, Button, Link } from "@mui/material";

import usePosition from "@/hooks/usePosition";

export default function PositionPrompt() {
  const position = usePosition();

  if (position.status === "loading" || position.status === "granted") return null;

  return (
    <Alert
      severity="info"
      action={
        position.status === "prompt"
          ? <Button onClick={() => position.request()}>Allow</Button>
          : <Button component={NextLink} href="/enable-location" target="_blank">Allow</Button>
      }
    >
      Allow location access to get more accurate address and place suggestions. Your location will only be used localize your experience. <Link component={NextLink} href="/privacy">Privacy policy</Link>
    </Alert>
  )
}