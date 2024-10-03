import React from "react";

import { Box, Container } from "@mui/material";


export default function Layout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
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
  );
}