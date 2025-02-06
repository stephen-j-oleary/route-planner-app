import { ReactNode } from "react";

import { Box } from "@mui/material";

import Ad from "@/components/Ad";


export default function Layout({
  children,
}: {
  children: ReactNode,
}) {
  return (
    <Box minHeight="100%" sx={{ backgroundColor: "background.default" }}>
      <Box component="main">
        {children}
      </Box>

      <Box height="56px" />

      <Ad
        adSlot="7020400075"
        sx={{
          position: "fixed",
          inset: "auto 0 0 0",
          zIndex: 2,
          backgroundColor: "grey.200",
          minHeight: "56px",
        }}
      />
    </Box>
  );
}