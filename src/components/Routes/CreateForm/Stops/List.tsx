import { isEmpty } from "lodash";
import React from "react";
import { Control, Controller, FieldPath, useFieldArray } from "react-hook-form";

import AddIcon from "@mui/icons-material/AddCircleOutlineRounded";
import { Box, BoxProps, Button, List } from "@mui/material";

import StopsListItem from "@/components/Routes/CreateForm/Stops/ListItem";
import { CreateRouteFormFields } from "@/components/Routes/CreateForm/useLogic";
import StopIconsContainer from "@/components/Routes/StopIcons/Container";
import useRouterQuery from "@/hooks/useRouterQuery";
import { Stop } from "@/models/Route";


export type StopsListProps = BoxProps & {
  control: Control<CreateRouteFormFields>,
  setFocus: (name: FieldPath<CreateRouteFormFields>) => void,
  watchStops: Pick<Stop, "fullText">[] | undefined,
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
  const query = useRouterQuery();

  const stopsFieldArray = useFieldArray<CreateRouteFormFields, "stops", "id">({ name: "stops" });
  const { fields, append } = stopsFieldArray;

  const isOrigin = (index: number) => index === +(watchOrigin || 0);
  const isDestination = (index: number) => index === +(watchDestination || 0);

  const handleAdd = () => {
    append({ fullText: "" });
    setFocus(`stops.${watchStops?.length ? watchStops.length - 1 : 0}.fullText`);
  };

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
                render={({ field: { onBlur, ...field } }) => (
                  <StopsListItem
                    stopIndex={index}
                    isOrigin={isOrigin(index)}
                    isDestination={isDestination(index)}
                    fieldArray={stopsFieldArray}
                    onBlur={() => {
                      onBlur();
                      query.set(
                        "stops",
                        (watchStops || [])
                          .map(v => v?.fullText)
                          .filter(v => !isEmpty(v))
                      );
                    }}
                    disabled={disabled}
                    {...field}
                  />
                )}
              />
            ))
          }
        </List>
      </Box>

      <Button
        size="medium"
        variant="text"
        startIcon={<AddIcon />}
        onClick={handleAdd}
        disabled={disabled}
      >
        Add Stop
      </Button>
    </Box>
  );
}