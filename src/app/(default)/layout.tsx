import { ReactNode } from "react";

import { Box } from "@mui/material";

import Header from "@/components/ui/Header";


export default function Layout({
  children,
}: {
  children: ReactNode,
}) {
  return (
    <Box
      minHeight="100%"
      display="flex"
      flexDirection="column"
      sx={{ backgroundColor: "background.default" }}
    >
      <Header />

      {children}
    </Box>
  );
}