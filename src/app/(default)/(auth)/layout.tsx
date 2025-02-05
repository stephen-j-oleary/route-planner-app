import { Metadata } from "next";
import { ReactNode } from "react";

import { Box, Container } from "@mui/material";

import Footer from "@/components/ui/Footer";


export default async function Layout({
  children,
}: {
  children: ReactNode,
}) {
  return (
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
        <Container
          maxWidth="sm"
          disableGutters
          sx={{ paddingY: 5 }}
        >
          <Box
            paddingY={3}
            paddingX={5}
            sx={{
              borderInline: "1px solid",
              borderColor: "grey.400",
            }}
          >
            {children}
          </Box>
        </Container>
      </Box>

      <Footer variant="compact" />
    </Box>
  );
}

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};