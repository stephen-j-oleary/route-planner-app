"use client";

import { Box } from "@mui/material";


export const BACKDROP_ID = "header-backdrop-portal";

export default function HeaderBackdrop() {
  return (
    <Box
      id={BACKDROP_ID}
      sx={{
        position: "fixed", // Create a stacking context so children are above app content
        zIndex: theme => theme.zIndex.appBar - 1,
      }}
    />
  );
}