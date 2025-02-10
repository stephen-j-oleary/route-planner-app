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
      <Box flex="1 0 0">
        <Box
          component="main"
          height="100%"
        >
          {children}
        </Box>
      </Box>

      <Footer />
    </>
  )
}