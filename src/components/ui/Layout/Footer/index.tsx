import Link from "next/link";

import { Button, Stack, Typography } from "@mui/material";

import Ad from "@/components/Ad";


export type FooterProps = {
  adSlot?: string,
};

export default function Footer({
  adSlot = undefined,
}: FooterProps) {
  return (
    <footer style={{ minHeight: "64px" }}>
      {
        adSlot && (
          <Ad
            adSlot={adSlot}/* "7020400075" */
            style={{ minHeight: "32px" }}
          />
        )
      }

      <Stack
        py={2}
        alignItems="center"
      >
        <Typography variant="h6" component="p">Company</Typography>
        <Button size="small" variant="text" component={Link} href="/cookies">Cookie policy</Button>
        <Button size="small" variant="text" component={Link} href="/privacy">Privacy policy</Button>
      </Stack>

      <Stack
        direction="row"
        spacing={1}
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="caption" component="span">Developed by <Link href="https://github.com/stephen-j-oleary" target="__blank">Stephen O&apos;Leary</Link></Typography>
      </Stack>
    </footer>
  );
}