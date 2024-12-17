import Link from "next/link";

import { Button, Stack, Typography } from "@mui/material";

import Ad from "@/components/Ad";
import pages from "pages";


export default function Footer() {
  return (
    <footer style={{ minHeight: "64px" }}>
      <Ad
        adSlot="7020400075"
        style={{ minHeight: "32px" }}
      />

      <Stack
        py={2}
        alignItems="center"
      >
        <Typography variant="h6" component="p">Company</Typography>
        <Button size="small" variant="text" component={Link} href={pages.cookies}>Cookie policy</Button>
        <Button size="small" variant="text" component={Link} href={pages.privacy}>Privacy policy</Button>
      </Stack>
    </footer>
  );
}