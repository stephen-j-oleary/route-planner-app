"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { Marker } from "@vis.gl/react-google-maps";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useFormState } from "react-dom";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { Alert, Box, BoxProps, Divider, Typography } from "@mui/material";

import { createRoute } from "./action";
import { minimumStopCount } from "./constants";
import StopsList from "./Stops/List";
import CollapseFieldset from "@/components/CollapseFieldset";
import CreateRouteFormSelectStopInput from "@/components/Routes/CreateForm/inputs/SelectStopInput";
import CreateRouteFormStopTimeInput from "@/components/Routes/CreateForm/inputs/StopTimeInput";
import useFocus from "@/components/ui/Map/useFocus";
import PositionPrompt from "@/components/ui/PositionPrompt";
import useLocalRoutes from "@/hooks/useLocalRoutes";
import pages from "pages";
import { RouteFormFields, RouteFormSchema } from "./schema";
import FormSubmit from "@/components/ui/FormSubmit";
import { LoadingButton } from "@mui/lab";
import { RouteRounded } from "@mui/icons-material";


export type CreateRouteFormProps =
  & BoxProps
  & {
    defaultValues?: RouteFormFields | (() => Promise<RouteFormFields>),
  };

export default function CreateRouteForm({
  defaultValues,
  ...props
}: CreateRouteFormProps) {
  const focus = useFocus();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const localRoutes = useLocalRoutes();

  const [state, formAction] = useFormState(
    createRoute,
    {},
  );
  const formRef = React.useRef<HTMLFormElement>(null);
  const form = useForm({
    mode: "all",
    shouldFocusError: false,
    defaultValues,
    resolver: yupResolver(RouteFormSchema),
  });

  React.useEffect(
    function storeRouteAndShowResult() {
      if (!state.route) return;

      const { _id } = localRoutes.create({
        ...state.route,
        editUrl: pathname || "",
      });

      router.push(`${pages.routes.root}/${_id}`);
    },
    [state.route]
  );


  React.useEffect(
    function syncUrlParams() {
      const { unsubscribe } = form.watch(({ stops, origin, destination, stopTime }) => {
        const params = new URLSearchParams(searchParams);
        if (stopTime) params.set("stopTime", stopTime.toString());
        else params.delete("stopTime");

        if (origin) params.set("origin", origin.toString())
        else params.delete("origin")

        if (destination) params.set("destination", destination.toString())
        else params.delete("destination")

        const stopsStr = (stops || [])
          .map(v => v?.fullText)
          .filter(v => v)
          .join("/");

        window.history.replaceState(null, "", `${pages.routes.create}/${stopsStr}?${params.toString()}`);
      });

      return () => unsubscribe();
    },
    [form, searchParams]
  );


  const watchStops = form.watch("stops") || [];
  const watchOrigin = +(form.watch("origin") || 0);
  const watchDestination = +(form.watch("destination") || 0);


  return (
    <FormProvider {...form}>
      <form
        ref={formRef}
        action={formAction}
        /* onSubmit={form.handleSubmit(
          () => formAction(new FormData(formRef.current!)),
        )} */
      >
        <Box {...props}>
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
              state.error && (
                <Alert
                  severity="error"
                  sx={{
                    marginBottom: 2,
                    "& > :first-letter": { textTransform: "uppercase" },
                  }}
                >
                  {state.error}
                </Alert>
              )
            }

            {
              watchStops.length - 1 < minimumStopCount && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ my: 1 }}
                >
                  Please add at least {minimumStopCount} stops
                </Typography>
              )
            }


            <FormSubmit
              renderSubmit={({ pending }) => (
                <LoadingButton
                  fullWidth
                  type="submit"
                  size="large"
                  variant="contained"
                  startIcon={<RouteRounded />}
                  loadingPosition="start"
                  loading={pending}
                  disabled={watchStops.length - 1 < minimumStopCount || form.formState.isLoading}
                >
                  Calculate route
                </LoadingButton>
              )}
            />
          </Box>
        </Box>
      </form>
    </FormProvider>
  );
}