import Link from "next/link";
import { ReactNode } from "react";

import { KeyboardArrowLeftRounded } from "@mui/icons-material";
import { Box, Button, Container, Paper } from "@mui/material";

import pages from "pages";


export default function Layout({
  children,
}: {
  children: ReactNode,
}) {
  return (
    <Container
      maxWidth="md"
      sx={{ paddingY: 5 }}
    >
      <Button
        size="medium"
        component={Link}
        href={pages.plans}
        startIcon={<KeyboardArrowLeftRounded />}
      >
        Back to plans
      </Button>

      <Box pt={2}>
        <Paper
          role="form"
          sx={{ padding: 2 }}
        >
          {children}
        </Paper>
      </Box>
    </Container>
  );
}