import NextLink from "next/link";

import { Box, BoxProps, Link, Stack, Typography } from "@mui/material";

import CookieSettings from "./CookieSettings";
import pages from "@/pages";


type FooterProps =
  & BoxProps
  & { variant?: "expanded" | "compact" | "service" };

export default function Footer({
  variant = "expanded",
  ...props
}: FooterProps) {
  return (
    <Box
      component="footer"
      display="grid"
      gridTemplateColumns={{
        xs: variant === "expanded" ? "1fr 1fr" : "1fr",
        sm: variant === "expanded"
          ? "3fr 1fr 1fr"
          : variant === "compact"
          ? "1fr auto"
          : "1fr"
      }}
      alignItems={
        variant === "expanded"
          ? "flex-start"
          : "flex-end"
      }
      columnGap={10}
      rowGap={2}
      py={2}
      px={3}
      {...props}
      sx={{
        backgroundColor: "background.paper",
        ...props.sx,
      }}
    >
      {
        variant !== "service" && (
          <Stack gridColumn={{ xs: "1 / -1", sm: "1 / 1" }}>
            <Typography component="p" variant="h5" fontWeight={600}>Loop</Typography>
            <Typography component="p" variant="caption">&copy; 2025 Loop Mapping. All rights reserved.</Typography>
          </Stack>
        )
      }

      {
        variant === "expanded" && (
          <Stack alignItems="flex-start" spacing={1}>
            <Link variant="body2" underline="hover" component={NextLink} href={pages.root} sx={{ textWrap: "nowrap" }}>Home</Link>
            <Link variant="body2" underline="hover" component={NextLink} href={pages.plans} sx={{ textWrap: "nowrap" }}>Plans</Link>
            <Link variant="body2" underline="hover" component={NextLink} href={pages.routes.saved} sx={{ textWrap: "nowrap" }}>My routes</Link>
            <Link variant="body2" underline="hover" component={NextLink} href={pages.routes.new} sx={{ textWrap: "nowrap" }}>Create a route</Link>
          </Stack>
        )
      }

      <Box
        display="flex"
        flexDirection={variant === "expanded" ? "column" : "row"}
        flexWrap={variant === "expanded" ? "nowrap" : "wrap"}
        columnGap={2}
        rowGap={1}
      >
        <Link variant="body2" underline="hover" component={NextLink} href={pages.cookies} sx={{ textWrap: "nowrap" }}>Cookie policy</Link>
        <Link variant="body2" underline="hover" component={NextLink} href={pages.privacy} sx={{ textWrap: "nowrap" }}>Privacy</Link>
        <Link variant="body2" underline="hover" component={NextLink} href={pages.sitemap} sx={{ textWrap: "nowrap" }}>Sitemap</Link>
        <CookieSettings variant="body2" underline="hover" component={NextLink} href="#" scroll={false} sx={{ textWrap: "nowrap" }}>Cookie settings</CookieSettings>
      </Box>
    </Box>
  );
}