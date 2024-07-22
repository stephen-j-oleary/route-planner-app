import { Box, Container, Typography } from "@mui/material";

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
    <Box px={2}>
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
    </Box>
  );
}

export const metadata = {
  title: "Loop Mapping - Create Route",
};