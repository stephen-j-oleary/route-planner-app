import "client-only";

import { useActionState, useEffect } from "react";

import { Alert, Box, StackProps } from "@mui/material";

import { createRoute } from "./action";
import RouteFormFooter from "./Footer";
import useRouteForm, { useRouteFormSyncParams } from "./hooks";
import RoutesHeader from "../Header";
import StopsList from "./Stops/List";
import { useMap } from "@/components/ui/Map/hooks";
import { TRoute } from "@/models/Route";
import { stringifyCoordinate } from "@/utils/coords";


export type RouteFormProps =
  & StackProps
  & {
    form: ReturnType<typeof useRouteForm>,
    onSuccess: (route: Omit<TRoute, "_id"> | null) => void,
  };

export default function RouteForm({
  form,
  onSuccess,
}: RouteFormProps) {
  const map = useMap();

  useEffect(
    () => {
      map?.setOptions({ draggableCursor: "pointer" });

      const listener = map?.addListener("click", (e: google.maps.MapMouseEvent) => {
        const coordinates = stringifyCoordinate(e.latLng?.toJSON() || {});
        if (!coordinates) return;
        form.addStop({ fullText: coordinates, coordinates });
      });

      return () => {
        listener?.remove();
        map?.setOptions({ draggableCursor: "grab" });
      }
    },
    [map, form]
  )

  useRouteFormSyncParams(form);

  const [result, formAction] = useActionState(
    createRoute,
    null,
  );

  useEffect(
    () => {
      if (!result?.route) return;
      onSuccess?.(result.route);
    },
    [result, onSuccess]
  );


  return (
    <form action={formAction} style={{ display: "contents" }}>
      <RoutesHeader
        title="Create a route"
      />

      <Box
        flex={1}
        display="grid"
        gridTemplateRows="auto 1fr"
        position="relative"
      >
        <Box>
          {
            result?.error && (
              <Alert
                severity="error"
                sx={{
                  marginBottom: 3,
                  "& > :first-letter": { textTransform: "uppercase" },
                }}
              >
                {result.error}
              </Alert>
            )
          }

          <StopsList form={form} />
        </Box>

        <Box alignSelf="flex-end" px={2}>
          <RouteFormFooter
            form={form}
          />
        </Box>
      </Box>
    </form>
  );
}