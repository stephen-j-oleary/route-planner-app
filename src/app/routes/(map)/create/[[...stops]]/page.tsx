import { Container, Typography } from "@mui/material";

import CreateRouteForm from "@/components/Routes/CreateForm";
import { PageProps } from "@/types/next";


export default async function CreateRoutePage({
  searchParams,
  params,
}: PageProps<{ stops: string[] | undefined }>) {
  const { stops = [] } = params;
  let { origin, destination, stopTime } = searchParams;
  origin = typeof origin === "string" ? origin : "0";
  destination = typeof destination === "string" ? destination : "0";
  stopTime = typeof stopTime === "string" ? stopTime : "0";


  return (
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
          stops: [
            ...stops.map(v => ({ fullText: v ? decodeURIComponent(v) : "" })),
            { fullText: "" },
          ],
          origin: +origin,
          destination: +destination,
          stopTime: +stopTime,
        }}
      />
    </Container>
  );
}

export const metadata = {
  title: "Loop Mapping - Create Route",
};