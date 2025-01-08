"use client";

import { useEffect } from "react";

import { Button } from "@mui/material";

import ViewError from "@/components/ui/ViewError";


export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string },
  reset: () => void,
}) {
  useEffect(
    () => console.error(error),
    [error]
  );

  return (
    <ViewError
      primary="An error occurred"
      secondary={error?.message}
      action={
        <Button
          variant="outlined"
          size="medium"
          onClick={() => reset()}
          sx={{ mx: "auto" }}
        >
          Retry
        </Button>
      }
    />
  );
}