"use client"; // Uses react effects and action states

import React from "react";
import { Controller, FormProvider } from "react-hook-form";

import { Alert, Box, BoxProps, Stack, Typography } from "@mui/material";

import { createRoute } from "./action";
import RoutesFormHeader from "./Header";
import useRouteForm, { useRouteFormSyncParams } from "./hooks";
import StopsList from "./Stops/List";
import CreateRouteFormSelectStopInput from "@/components/Routes/CreateForm/inputs/SelectStopInput";
import CreateRouteFormStopTimeInput from "@/components/Routes/CreateForm/inputs/StopTimeInput";
import PositionPrompt from "@/components/ui/PositionPrompt";
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

  const [result, formAction] = React.useActionState(
    createRoute,
    {},
  );

  React.useEffect(
    () => {
      if (!result.route) return;
      onSuccess?.(result.route);
    },
    [result]
  );


  const watchStops = form.watch("stops") || [];
  const watchOrigin = +(form.watch("origin") || 0);
  const watchDestination = +(form.watch("destination") || 0);


  return (
    <FormProvider {...form}>
      <form action={formAction}>
        <RoutesFormHeader
          stops={watchStops}
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

          <Box gridColumn="1 / -1">
            <PositionPrompt />
          </Box>

          <StopsList
            control={form.control}
            setFocus={form.setFocus}
            watchStops={watchStops}
            watchOrigin={watchOrigin}
            watchDestination={watchDestination}
            disabled={form.formState.isLoading}
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
              <Controller
                name="origin"
                control={form.control}
                render={({ field, fieldState }) => (
                  <CreateRouteFormSelectStopInput
                    label="Origin"
                    watchStops={watchStops}
                    fieldState={fieldState}
                    {...field}
                  />
                )}
              />

              <Controller
                name="destination"
                control={form.control}
                render={({ field, fieldState }) => (
                  <CreateRouteFormSelectStopInput
                    label="Destination"
                    watchStops={watchStops}
                    fieldState={fieldState}
                    {...field}
                  />
                )}
              />

              <Controller
                name="stopTime"
                control={form.control}
                render={({ field, fieldState }) => (
                  <CreateRouteFormStopTimeInput
                    fieldState={fieldState}
                    {...field}
                  />
                )}
              />
            </Box>
          </Stack>
        </Box>
      </form>
    </FormProvider>
  );
}