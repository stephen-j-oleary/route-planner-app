"use client";

import { captureException } from "@sentry/nextjs";
import React from "react";

import { Button } from "@mui/material";

import ViewError from "@/components/ui/ViewError";


export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string },
  reset: () => void,
}) {
  React.useEffect(
    () => {
      console.error(error);
      captureException(error);
    },
    [error]
  );

  return (
    <html>
      <head />
      <body>
        <ViewError
          primary="An error occurred"
          secondary={error.message}
          action={
            <Button
              variant="outlined"
              size="medium"
              onClick={() => reset()}
              sx={{ mx: "auto" }}
            >
              Reload
            </Button>
          }
        />
      </body>
    </html>
  );
}