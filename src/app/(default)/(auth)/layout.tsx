import { ReactNode } from "react";

import { Box, Container } from "@mui/material";

import Footer from "@/components/ui/Footer";


export default function Layout({
  children,
}: {
  children: ReactNode,
}) {
  return (
    <Box>
      <Box component="main">
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

      <Footer variant="compact" position="fixed" sx={{ inset: "auto 0 0 0" }} />
    </Box>
  );
}