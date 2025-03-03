import { ReactNode } from "react";

import { Box, Container, Typography } from "@mui/material";


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
      <Typography variant="h1">Loop Plans</Typography>
      <Typography component="p" variant="body1">Choose a plan that fits your needs</Typography>

      <Box mt={5}>
        {children}
      </Box>
    </Container>
  );
}