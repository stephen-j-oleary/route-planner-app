import { isEqual } from "lodash";
import React from "react";
import { UseFieldArrayReturn } from "react-hook-form";
import { useMutation } from "react-query";

import { Box, CircularProgress, InputAdornment, ListItem } from "@mui/material";

import { CreateRouteFormContext } from "../Context";
import AddressInput, { AddressInputProps } from "@/components/AddressInput";
import StopsListItemActions from "@/components/Routes/CreateForm/Stops/ListItemActions";
import { CreateRouteFormFields } from "@/components/Routes/CreateForm/useLogic";
import StopIcon from "@/components/Routes/StopIcons/Item";
import { Stop } from "@/models/Route";
import { getGeocode } from "@/services/geocode";
import { COORDINATES } from "@/utils/patterns";


export type StopsListItemProps = AddressInputProps & {
  stopIndex: number,
  isOrigin: boolean,
  isDestination: boolean,
  fieldArray: UseFieldArrayReturn<CreateRouteFormFields, "stops", "id">,
  disabled?: boolean,
};

const StopsListItem = React.forwardRef(function StopsListItem({
  stopIndex,
  isOrigin,
  isDestination,
  fieldArray,
  disabled,
  onFocus,
  onBlur,
  ...props
}: StopsListItemProps, ref) {
  const [geocodeEnabled, setGeocodeEnabled] = React.useState(true);
  const { form } = React.useContext(CreateRouteFormContext);

  const { mutateAsync: geocodeMutateAsync, ...geocodeMutation } = useMutation({
    mutationFn: async (stop: Pick<Stop, "fullText"> & Partial<Omit<Stop, "fullText">>) => {
      if (!stop || !stop.fullText) return null;
      if (stop.coordinates) return stop.coordinates;
      if (COORDINATES.test(stop.fullText)) {
        const [lat, lng] = stop.fullText.split(",");
        const tuple: [number, number] = [+lat.trim(), +lng.trim()];
        return tuple;
      }
      const res = await getGeocode({ q: stop.fullText });
      return res?.results?.[0]?.coordinates || null;
    },
  });

  const handleGeocode = React.useCallback(
    async () => {
      if (!geocodeEnabled || !props.value) return;

      const coords = await geocodeMutateAsync(props.value);
      if (!coords || isEqual(props.value?.coordinates, coords)) return;

      form?.setValue(`stops.${stopIndex}.coordinates`, coords);
    },
    [form, geocodeMutateAsync, geocodeEnabled, stopIndex, props.value]
  );
  const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    onFocus?.(e);
    setGeocodeEnabled(false);
  };
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    onBlur?.(e);
    setGeocodeEnabled(true);
    handleGeocode();
  };

  React.useEffect(
    () => void handleGeocode(),
    [handleGeocode]
  );


  return (
    <ListItem
      sx={{
        gap: 2,
        backgroundColor: "background.paper",
        paddingX: 0,
        cursor: "text",
        "& .actions": {
          transition: "opacity .2s ease-out",
          opacity: 1,
        },
        "@media (hover: hover)": {
          "&:not(:hover) .actions": { opacity: 0 },
        },
      }}
    >
      <StopIcon
        isOrigin={isOrigin}
        isDestination={isDestination}
      />

      <Box flex="1 1 auto">
        <AddressInput
          ref={ref}
          disabled={disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          textFieldProps={{
            InputProps: {
              endAdornment: geocodeMutation.isLoading && (
                <InputAdornment position="end">
                  <CircularProgress size="1rem" />
                </InputAdornment>
              ),
            },
          }}
          {...props}
        />
      </Box>

      <StopsListItemActions
        className="actions"
        stopIndex={stopIndex}
        fieldArray={fieldArray}
        disabled={disabled}
      />
    </ListItem>
  );
})

export default StopsListItem