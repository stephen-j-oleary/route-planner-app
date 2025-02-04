"use client";

import { useCallback, useEffect } from "react";

import { Box, BoxProps, List, Typography } from "@mui/material";

import useRouteForm from "../hooks";
import { minStopCount } from "../schema";
import StopsListItem from "@/components/Routes/CreateForm/Stops/ListItem";
import StopIconsContainer from "@/components/Routes/StopIcons/Container";
import { Stop } from "@/models/Route";


export type StopsListProps =
  & BoxProps
  & {
    form: ReturnType<typeof useRouteForm>,
  };

export default function StopsList({
  form,
  ...props
}: StopsListProps) {
  const isOrigin = (index: number) => index === +(form.origin || 0);
  const isDestination = (index: number) => index === +(form.destination || 0);
  const isAdd = (index: number) => index === form.stops.length - 1;

  const handleAdd = useCallback(
    () => form.setStops(arr => [...arr, { fullText: "" }]),
    [form]
  );
  const handleRemove = (index: number) => form.setStops(arr => arr.filter((v, i) => i !== index));
  const handleChange = (index: number, value: Partial<Stop>) => form.setStops(arr => arr.map((v, i) => i === index ? value : v));

  const isLastStopEmpty = !form.stops[form.stops.length - 1]?.fullText;
  useEffect(
    function keepEmptyStopFieldAtEnd() {
      if (!isLastStopEmpty) handleAdd();
    },
    [isLastStopEmpty, handleAdd]
  );

  return (
    <Box>
      <Box
        sx={{ position: "relative" }}
        {...props}
      >
        <StopIconsContainer />

        <List disablePadding>
          {
            form.stops.map((field, index) => (
              <StopsListItem
                key={index}
                form={form}
                name={`stops.${index}`}
                value={field}
                onChange={v => handleChange(index, v)}
                onRemove={() => handleRemove(index)}
                stopIndex={index}
                iconProps={{
                  isOrigin: isOrigin(index),
                  isDestination: isDestination(index),
                  isAdd: isAdd(index),
                }}
              />
            ))
          }
        </List>

        <Typography variant="caption" color="text.secondary">
          Please add at least {minStopCount} stops
        </Typography>
      </Box>
    </Box>
  );
}