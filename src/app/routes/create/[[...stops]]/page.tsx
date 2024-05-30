import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Container, Paper, Typography } from "@mui/material";

import CreateRouteForm from "@/components/Routes/CreateForm";
import { minimumStopCount } from "@/components/Routes/CreateForm/constants";
import CreateRouteFormContextProvider from "@/components/Routes/CreateForm/Context";
import CreateRouteFormMap from "@/components/Routes/CreateForm/Map";
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
    <CreateRouteFormContextProvider
      defaultValues={{
        stops: getDefaultStops(),
        origin: +origin,
        destination: +destination,
        stopTime: +stopTime,
      }}
    >
      <CreateRouteFormMap />

      <Paper>
        <Container
          maxWidth="sm"
          disableGutters
          sx={{
            marginY: 3,
            paddingX: 3,
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

          <CreateRouteForm />
        </Container>
      </Paper>
    </CreateRouteFormContextProvider>
  );
}

export const metadata = {
  title: "Loop Mapping - Create Route",
};