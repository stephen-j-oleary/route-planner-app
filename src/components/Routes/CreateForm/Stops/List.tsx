import "client-only";

import React from "react";
import { Control, Controller, FieldPath, useFieldArray } from "react-hook-form";

import { Box, BoxProps, List } from "@mui/material";

import { RouteFormFields } from "@/components/Routes/CreateForm/schema";
import StopsListItem from "@/components/Routes/CreateForm/Stops/ListItem";
import StopIconsContainer from "@/components/Routes/StopIcons/Container";
import { Stop } from "@/models/Route";


export type StopsListProps = BoxProps & {
  control: Control<RouteFormFields>,
  setFocus: (name: FieldPath<RouteFormFields>) => void,
  watchStops: Pick<Stop, "fullText">[],
  watchOrigin: number | undefined,
  watchDestination: number | undefined,
  disabled?: boolean,
}

export default function StopsList({
  control,
  setFocus,
  watchStops,
  watchOrigin,
  watchDestination,
  disabled = false,
  ...props
}: StopsListProps) {
  const stopsFieldArray = useFieldArray<RouteFormFields, "stops", "id">({ control, name: "stops" });
  const { fields, append } = stopsFieldArray;

  const isOrigin = (index: number) => index === +(watchOrigin || 0);
  const isDestination = (index: number) => index === +(watchDestination || 0);
  const isAdd = (index: number) => index === fields.length - 1;

  const isLastStopEmpty = watchStops[watchStops.length - 1]?.fullText === "";
  React.useEffect(
    function keepEmptyStopFieldAtEnd() {
      if (!isLastStopEmpty) append({ fullText: "" });
    },
    [isLastStopEmpty, append]
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
            fields.map((field, index) => (
              <Controller
                key={field.id}
                control={control}
                name={`stops.${index}`}
                render={({ field }) => (
                  <StopsListItem
                    stopIndex={index}
                    isOrigin={isOrigin(index)}
                    isDestination={isDestination(index)}
                    isAdd={isAdd(index)}
                    fieldArray={stopsFieldArray}
                    disabled={disabled}
                    {...field}
                  />
                )}
              />
            ))
          }
        </List>
      </Box>
    </Box>
  );
}