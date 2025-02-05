"use client"; // Uses react effects and action states

import { useActionState, useEffect } from "react";

import { Alert, Box, Stack, StackProps, Typography } from "@mui/material";

import { createRoute } from "./action";
import RouteFormFooter from "./Footer";
import useRouteForm, { useRouteFormSyncParams } from "./hooks";
import RoutesHeader from "../Header";
import StopsList from "./Stops/List";
import { IRoute } from "@/models/Route";


export type CreateRouteFormProps =
  & StackProps
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
      <RoutesHeader>
        <Typography
          component="h1"
          variant="h3"
        >
          Create a route
        </Typography>
      </RoutesHeader>

      <Stack
        flex={1}
        spacing={1}
        {...props}
      >
        <Box>
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

        <StopsList form={form} />
      </Stack>

      <RouteFormFooter
        form={form}
      />
    </form>
  );
}