"use client";

import { useState } from "react";

import { RouteRounded, TuneRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Collapse, IconButton, Stack, Tooltip, Typography } from "@mui/material";

import useRouteForm from "./hooks";
import CreateRouteFormSelectStopInput from "./inputs/SelectStopInput";
import CreateRouteFormStopTimeInput from "./inputs/StopTimeInput";
import { minStopCount } from "./schema";
import FormSubmit from "@/components/ui/FormSubmit";


export default function RouteFormFooter({
  form,
}: {
  form: ReturnType<typeof useRouteForm>,
}) {
  const [isOptionsOpen, setIsOptionsOpen] = useState(true);

  return (
    <Box>
      <Collapse in={isOptionsOpen}>
        <Stack spacing={2} py={2}>
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
      </Collapse>

      <Stack width="100%" direction="row" spacing={1}>
        <IconButton
          onClick={() => setIsOptionsOpen(v => !v)}
          color={isOptionsOpen ? "primary" : "inherit"}
        >
          <TuneRounded />
        </IconButton>

        <FormSubmit
          renderSubmit={({ pending }) => (
            <Tooltip
              title={form.stops.length - 1 < minStopCount && `Please add at least ${minStopCount} stops`}
            >
              <span style={{ flex: "1 0 0" }}>
                <LoadingButton
                  fullWidth
                  type="submit"
                  size="medium"
                  variant="contained"
                  startIcon={<RouteRounded />}
                  loadingPosition="start"
                  loading={pending}
                  disabled={form.stops.length - 1 < minStopCount}
                >
                  Calculate route
                </LoadingButton>
              </span>
            </Tooltip>
          )}
        />
      </Stack>
    </Box>
  );
}