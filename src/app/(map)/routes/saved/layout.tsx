import Link from "next/link";
import { ReactNode } from "react";

import { RouteRounded } from "@mui/icons-material";
import { Box, Button } from "@mui/material";

import RoutesHeader from "@/components/Routes/Header";
import pages from "@/pages";


export default function Layout({
  children,
}: {
  children: ReactNode,
}) {
  return (
    <>
      <RoutesHeader
        title="Saved routes"
      />

      <Box flex={1} px={1}>
        {children}
      </Box>

      <Box px={1}>
        <Button
          fullWidth
          size="medium"
          variant="contained"
          startIcon={<RouteRounded />}
          component={Link}
          href={pages.routes.new}
        >
          Create a route
        </Button>
      </Box>
    </>
  );
}