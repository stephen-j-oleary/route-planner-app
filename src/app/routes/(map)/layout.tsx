import { cookies } from "next/headers";
import React from "react";

import { Box, Paper } from "@mui/material";

import Map from "@/components/ui/Map";
import MapProvider from "@/components/ui/Map/Provider";
import { auth, authRedirect } from "@/utils/auth";
import pages from "pages";


export default async function Layout({
  children,
}: {
  children: React.ReactNode,
}) {
  const { userId, emailVerified } = await auth(cookies());
  if (!userId) authRedirect(pages.login);
  if (!emailVerified) authRedirect(pages.account.verify);

  return (
    <MapProvider>
      <Box
        position="relative"
        width="100%"
        height="80dvh"
      >
        <Map
          mapId="routesMap"
          defaultCenter={{ lat: 51.0447, lng: -114.0719 }}
          defaultZoom={10}
        />
      </Box>

      <Paper sx={{ p: 2 }}>
        {children}
      </Paper>
    </MapProvider>
  );
}