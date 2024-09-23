import React from "react";

import { Stack } from "@mui/material";


export default function RoutesHeader({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      px={2}
      pb={2}
      sx={{
        borderBottom: "1px solid",
        borderBottomColor: "grey.200",
        "& > div:first-of-type": { flex: 1 },
      }}
    >
      {children}
    </Stack>
  )
}