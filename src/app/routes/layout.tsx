"use client";

import { usePathname } from "next/navigation";
import React from "react";

import { Container, Grid } from "@mui/material";


export default function Layout({
  createRoute,
  savedRoutes,
  children,
}: {
  createRoute: React.ReactNode,
  savedRoutes: React.ReactNode,
  children: React.ReactNode,
}) {
  const pathname = usePathname();

  return (
    <>
      {
        pathname?.endsWith("/routes") && (
          <Container
            maxWidth="md"
            sx={{ paddingY: 4 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                {createRoute}
              </Grid>

              <Grid item xs={12} md={6}>
                {savedRoutes}
              </Grid>
            </Grid>
          </Container>
        )
      }

      {children}
    </>
  );
}