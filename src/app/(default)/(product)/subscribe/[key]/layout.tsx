import { headers } from "next/headers";
import { ReactNode } from "react";

import { Box, Container, Paper } from "@mui/material";

import BackButton from "./components/BackButton";


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
      <BackButton
        headerStore={Object.fromEntries(headers().entries())}
      />

      <Box mt={5}>
        <Paper role="form">
          <Container maxWidth="sm" sx={{ padding: 2 }}>
            {children}
          </Container>
        </Paper>
      </Box>
    </Container>
  );
}