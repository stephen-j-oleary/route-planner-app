import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Box, Container, Paper, Typography } from "@mui/material";

import CreateRouteForm from "@/components/Routes/CreateForm";
import { minimumStopCount } from "@/components/Routes/CreateForm/constants";
import Map from "@/components/ui/Map";
import MapProvider from "@/components/ui/Map/Provider";
import ScrollResize from "@/components/ui/ScrollResize";
import { Stop } from "@/models/Route";
import { PageProps } from "@/types/next";
import { auth } from "@/utils/auth";


export default async function CreateRoutePage({
  searchParams,
  params,
}: PageProps<{ stops: string[] | undefined }>) {
  const { userId, emailVerified } = await auth(cookies());
  if (!userId) redirect("/login");
  if (!emailVerified) redirect("/account/verify");

  const { stops = [] } = params;
  let { origin, destination, stopTime } = searchParams;
  origin = typeof origin === "string" ? origin : "0";
  destination = typeof destination === "string" ? destination : "0";
  stopTime = typeof stopTime === "string" ? stopTime : "0";

  const getDefaultStops = () => {
    const defStops: (Pick<Stop, "fullText"> & Partial<Omit<Stop, "fullText">>)[] = ((Array.isArray(stops) && stops) || []).map(v => ({ fullText: v || "" }));
    defStops.length = Math.max(stops.length, minimumStopCount);

    return defStops.fill({ fullText: "" }, stops.length);
  };


  return (
    <MapProvider>
      <ScrollResize
        min="25dvh"
        max="50dvh"
      >
        <Box
          position="relative"
          width="100%"
          height="100%"
        >
          <Map
            defaultCenter={{ lat: 51.0447, lng: -114.0719 }}
            defaultZoom={10}
          />
        </Box>
      </ScrollResize>

      <Paper sx={{ py: 3 }}>
        <Container
          maxWidth="sm"
          disableGutters
          sx={{
            px: 3,
            borderInline: "1px solid",
            borderColor: "grey.300",
          }}
        >
          <Typography
            component="h1"
            variant="h3"
            paddingBottom={2}
          >
            Create a route
          </Typography>

          <CreateRouteForm
            defaultValues={{
              stops: getDefaultStops(),
              origin: +origin,
              destination: +destination,
              stopTime: +stopTime,
            }}
          />
        </Container>
      </Paper>
    </MapProvider>
  );
}

export const metadata = {
  title: "Loop Mapping - Create Route",
};