import { MailRounded } from "@mui/icons-material";
import { Box, Container, Typography } from "@mui/material";


export default function Page() {
  return (
    <Container
      maxWidth="sm"
      sx={{ paddingY: 5 }}
    >
      <Typography variant="h1">Contact us</Typography>
      <Typography component="p" variant="body1">Your experience matters — let&apos;s make it better together!</Typography>

      <Box
        display="grid"
        gridTemplateColumns="auto 1fr"
        gap={2}
        py={5}
      >
        <MailRounded />

        <Typography variant="body1">loopmapping@gmail.com</Typography>
      </Box>
    </Container>
  );
}