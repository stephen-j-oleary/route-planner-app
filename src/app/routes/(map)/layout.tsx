import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

import { Box, Paper } from "@mui/material";

import Map from "@/components/ui/Map";
import MapProvider from "@/components/ui/Map/Provider";
import { auth } from "@/utils/auth";
import pages from "pages";


export default async function Layout({
  children,
}: {
  children: React.ReactNode,
}) {
  const { userId, emailVerified } = await auth(cookies());
  if (!userId) redirect(pages.login);
  if (!emailVerified) redirect(pages.account.verify);

  return (
    <MapProvider>
      <Box
        position="relative"
        width="100%"
        height="80dvh"
      >
        <Map
          defaultCenter={{ lat: 51.0447, lng: -114.0719 }}
          defaultZoom={10}
        />
      </Box>

      <Paper sx={{ py: 3 }}>
        {children}
      </Paper>
    </MapProvider>
  );
}