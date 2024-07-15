"use client";

import { Marker } from "@vis.gl/react-google-maps";
import { Controller, FormProvider } from "react-hook-form";

import { Alert, Box, BoxProps, Divider } from "@mui/material";

import StopsList from "./Stops/List";
import useCreateRouteFormApi from "./useApi";
import useCreateRouteFormLogic, { UseCreateRouteFormLogicProps } from "./useLogic";
import CollapseFieldset from "@/components/CollapseFieldset";
import CreateRouteFormSelectStopInput from "@/components/Routes/CreateForm/inputs/SelectStopInput";
import CreateRouteFormStopTimeInput from "@/components/Routes/CreateForm/inputs/StopTimeInput";
import CreateRouteFormSubmit from "@/components/Routes/CreateForm/inputs/Submit";
import useFocus from "@/components/ui/Map/useFocus";
import PositionPrompt from "@/components/ui/PositionPrompt";


export type CreateRouteFormViewProps =
  & BoxProps
  & Pick<UseCreateRouteFormLogicProps, "defaultValues">;

export default function CreateRouteFormView({
  defaultValues,
  ...props
}: CreateRouteFormViewProps) {
  const focus = useFocus();

  const { onSubmit } = useCreateRouteFormApi();
  const {
    error,
    form,
    getFormProps,
    getSubmitProps,
  } = useCreateRouteFormLogic({ onSubmit, defaultValues });

  const watchStops = form.watch("stops") || [];
  const watchOrigin = +(form.watch("origin") || 0);
  const watchDestination = +(form.watch("destination") || 0);


  return (
    <FormProvider {...form}>
      <Box
        component="form"
        {...getFormProps()}
        {...props}
      >
        <PositionPrompt />

        <StopsList
          control={form.control}
          setFocus={form.setFocus}
          watchStops={watchStops}
          watchOrigin={watchOrigin}
          watchDestination={watchDestination}
          disabled={form.formState.isLoading}
        />

        {
          watchStops
            .map((stop, i) => {
              const coord = stop.coordinates && { lat: stop.coordinates[0], lng: stop.coordinates[1] };

              if (coord) focus([coord]);

              return coord && (
                <Marker
                  key={i}
                  label={(i + 1).toString()}
                  position={coord}
                />
              );
            })
        }

        <Divider
          sx={{
            marginY: 2,
            borderBottomWidth: 2,
            borderColor: "grey.300",
          }}
        />

        <CollapseFieldset
          primary="Route Options"
          defaultShow
        >
          <Box
            marginY={3}
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
        </CollapseFieldset>

        <Box marginTop={3}>
          {
            error && (
              <Alert
                severity="error"
                sx={{
                  marginBottom: 2,
                  "& > :first-letter": { textTransform: "uppercase" },
                }}
              >
                {error || "An error occurred"}
              </Alert>
            )
          }

          <CreateRouteFormSubmit
            {...getSubmitProps()}
          />
        </Box>
      </Box> {/* form */}
    </FormProvider>
  );
}