import { ReactNode } from "react";

import { Box, Paper } from "@mui/material";

import Ad from "@/components/Ad";
import Header from "@/components/ui/Header";
import Map from "@/components/ui/Map";
import MapProvider from "@/components/ui/Map/Provider";


const AD_HEIGHT = "56px";

export default function Layout({
  children,
}: {
  children: ReactNode,
}) {
  return (
    <Box
      position="fixed"
      sx={{
        backgroundColor: "background.default",
        inset: 0,
        overflow: "hidden",
      }}
    >
      <Header variant="compact" />

      <Box
        component="main"
        display="grid"
        gridTemplateColumns={{ xs: "1fr", sm: "2fr 1fr" }}
        gridTemplateRows={{ xs: "minmax(50%, 1fr) auto", sm: "1fr" }}
        position="absolute"
        sx={{
          inset: `0 0 ${AD_HEIGHT} 0`,
          overflow: "hidden",
        }}
      >
        <MapProvider>
          <Box
            position="relative"
            width="100%"
            height="100%"
            minHeight={0}
          >
            <Map
              mapId="routesMap"
              defaultCenter={{ lat: 51.0447, lng: -114.0719 }}
              defaultZoom={10}
            />
          </Box>

          <Paper
            sx={{
              p: 2,
              overflowY: "scroll",
              "& > *": {
                height: "100%",
                display: "flex",
                flexDirection: "column",
              },
            }}
          >
            {children}
          </Paper>
        </MapProvider>
      </Box>

      <Ad
        adSlot="7020400075"
        sx={{
          position: "fixed",
          inset: "auto 0 0 0",
          backgroundColor: "grey.200",
          minHeight: AD_HEIGHT,
        }}
      />
    </Box>
  );
}