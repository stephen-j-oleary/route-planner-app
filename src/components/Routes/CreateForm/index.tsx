"use client"; // Uses react effects and action states

import { useActionState, useEffect } from "react";

import { Alert, Box, BoxProps, Stack, Typography } from "@mui/material";

import { createRoute } from "./action";
import RoutesFormHeader from "./Header";
import useRouteForm, { useRouteFormSyncParams } from "./hooks";
import StopsList from "./Stops/List";
import CreateRouteFormSelectStopInput from "@/components/Routes/CreateForm/inputs/SelectStopInput";
import CreateRouteFormStopTimeInput from "@/components/Routes/CreateForm/inputs/StopTimeInput";
import { IRoute } from "@/models/Route";


export type CreateRouteFormProps =
  & BoxProps
  & {
    form: ReturnType<typeof useRouteForm>,
    onSuccess?: (route: Omit<IRoute, "_id"> | null) => void,
  };

export default function CreateRouteForm({
  form,
  onSuccess,
  ...props
}: CreateRouteFormProps) {
  useRouteFormSyncParams(form);

  const [result, formAction] = useActionState(
    createRoute,
    {},
  );

  useEffect(
    () => {
      if (!result.route) return;
      onSuccess?.(result.route);
    },
    [result, onSuccess]
  );


  return (
    <form action={formAction}>
      <RoutesFormHeader
        stops={form.stops}
      />

      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", sm: "2fr 1fr" }}
        columnGap={2}
        alignItems="flex-start"
        my={3}
        {...props}
      >
        <Box gridColumn="1 / -1">
          {
            result.error && (
              <Alert
                severity="error"
                sx={{
                  marginBottom: 2,
                  "& > :first-letter": { textTransform: "uppercase" },
                }}
              >
                {result.error}
              </Alert>
            )
          }
        </Box>

        <StopsList
          form={form}
        />

        <Stack spacing={2}>
          <Typography
            component="p"
            variant="h6"
          >
            Additional Options
          </Typography>

          <Box
            display="grid"
            gridTemplateColumns="minmax(0, 1fr)"
            gap={2}
          >
            <CreateRouteFormSelectStopInput
              name="origin"
              value={form.origin}
              onChange={v => form.setOrigin(v)}
              label="Origin"
              watchStops={form.stops}
            />

            <CreateRouteFormSelectStopInput
              name="destination"
              value={form.destination}
              onChange={v => form.setDestination(v)}
              label="Destination"
              watchStops={form.stops}
            />

            <CreateRouteFormStopTimeInput
              name="stopTime"
              value={form.stopTime}
              onChange={v => form.setStopTime(v)}
              required
              slotProps={{ htmlInput: { min: 0 } }}
            />
          </Box>
        </Stack>
      </Box>
    </form>
  );
}