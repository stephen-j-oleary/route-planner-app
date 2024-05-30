import Link from "next/link";
import React from "react";

import { KeyboardArrowLeftRounded } from "@mui/icons-material";
import { Box, Button, Container } from "@mui/material";


export default function Layout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <Container
      maxWidth="md"
      sx={{ paddingY: 5 }}
    >
      <Button
        size="medium"
        component={Link}
        href="/plans"
        startIcon={<KeyboardArrowLeftRounded />}
      >
        Back to plans
      </Button>

      <Box pt={2}>
        {children}
      </Box>
    </Container>
  );
}