import { ReactNode } from "react";

import { Box } from "@mui/material";

import Footer from "@/components/ui/Footer";


export default function Layout({
  children,
}: {
  children: ReactNode,
}) {
  return (
    <>
      <Box
        display="table"
        width="100%"
        height="100%"
      >
        <Box
          component="main"
          display="table-row"
          height="100%"
          sx={{ backgroundColor: "background.default" }}
        >
          {children}
        </Box>
      </Box>

      <Footer />
    </>
  )
}