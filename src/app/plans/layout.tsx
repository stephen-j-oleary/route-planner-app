import { ReactNode } from "react";

import { Box, Container, Typography } from "@mui/material";


export default function Layout({
  children,
}: {
  children: ReactNode,
}) {
  return (
    <Container
      maxWidth="sm"
      sx={{ paddingY: 5 }}
    >
      <Typography component="p" variant="h1">Loop Subscriptions</Typography>
      <Typography component="p" variant="body1">Gain access to premium features</Typography>

      <Box mt={5}>
        {children}
      </Box>
    </Container>
  );
}