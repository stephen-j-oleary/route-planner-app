import { ReactNode } from "react";

import { Box, Container, Paper, Stack } from "@mui/material";

import Ad from "@/components/Ad";
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import Map from "@/components/ui/Map";
import MapProvider from "@/components/ui/Map/Provider";
import pages from "@/pages";
import auth from "@/utils/auth";


const AD_HEIGHT = "56px";

export default async function Layout({
  children,
}: {
  children: ReactNode,
}) {
  await auth(pages.routes.root).flow();

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
        gridTemplateColumns={{ xs: "1fr", md: "4fr 3fr" }}
        gridTemplateRows={{ xs: "minmax(50%, 1fr) auto", md: "1fr" }}
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
              mapId={process.env.LOOP_GOOGLE_MAP_ID}
              defaultCenter={{ lat: 51.0447, lng: -114.0719 }}
              defaultZoom={10}
            />
          </Box>

          <Paper
            sx={{
              overflowY: "scroll",
              minHeight: "100%",
            }}
          >
            <Container
              maxWidth="sm"
              disableGutters
              sx={{
                height: "100%",
                display: "grid",
                gridTemplateRows: "1fr auto",
              }}
            >
              <Stack>
                {children}
              </Stack>

              <Footer
                variant="service"
                p={2}
              />
            </Container>
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