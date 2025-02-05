import Link from "next/link";
import { ReactNode } from "react";

import { RouteRounded } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";

import RoutesHeader from "@/components/Routes/Header";
import pages from "@/pages";


export default function Layout({
  children,
}: {
  children: ReactNode,
}) {
  return (
    <div>
      <RoutesHeader>
        <Typography
          component="h1"
          variant="h3"
        >
          Saved Routes
        </Typography>

        <Button
          size="medium"
          variant="text"
          startIcon={<RouteRounded />}
          component={Link}
          href={pages.routes.new}
        >
          Create a route
        </Button>
      </RoutesHeader>

      {children}
    </div>
  );
}