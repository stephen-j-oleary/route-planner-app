import "client-only";

import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import mergeRefs from "merge-refs";
import React from "react";
import { UseFieldArrayReturn } from "react-hook-form";

import { Box, ListItem } from "@mui/material";

import CreateRouteFormAddress from "@/components/Routes/CreateForm/inputs/Address";
import { minStopCount, RouteFormFields } from "@/components/Routes/CreateForm/schema";
import StopsListItemActions from "@/components/Routes/CreateForm/Stops/ListItemActions";
import StopIcon from "@/components/Routes/StopIcons/Item";
import AddressAutocomplete from "@/components/ui/AddressAutocomplete";
import { AddressAutocompleteOption } from "@/components/ui/AddressAutocomplete/hooks";
import { useMapFocus } from "@/components/ui/Map/hooks";
import { parseCoordinate } from "@/utils/coords";


export type StopsListItemProps = {
  ref: React.Ref<HTMLElement>
  name: string,
  value: Partial<AddressAutocompleteOption> | null,
  onChange: (v: Partial<AddressAutocompleteOption> | null) => void,
  onFocus?: (e: React.FocusEvent<HTMLElement>) => void,
  onBlur?: (e: React.FocusEvent<HTMLElement>) => void,
  stopIndex: number,
  isOrigin: boolean,
  isDestination: boolean,
  isAdd: boolean,
  fieldArray: UseFieldArrayReturn<RouteFormFields, "stops", "id">,
  disabled?: boolean,
};

export default function StopsListItem({
  ref,
  name,
  value,
  onChange,
  onFocus,
  onBlur,
  stopIndex,
  isOrigin,
  isDestination,
  isAdd,
  fieldArray,
  disabled,
}: StopsListItemProps) {
  const coord = React.useMemo(
    () => parseCoordinate(value?.coordinates || value?.fullText),
    [value]
  );

  useMapFocus([coord]);

  return (
    <ListItem
      sx={{
        gap: 2,
        backgroundColor: "background.paper",
        px: 0,
        py: 1,
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
      {
        coord && (
          <AdvancedMarker position={coord}>
            <Pin>
              {(stopIndex + 1).toString()}
            </Pin>
          </AdvancedMarker>
        )
      }

      <StopIcon
        isOrigin={isOrigin}
        isDestination={isDestination}
        isAdd={isAdd}
      />

      <Box flex="1 1 auto">
        <AddressAutocomplete
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
          renderInput={params => (
            <CreateRouteFormAddress
              name={`${name}.fullText`}
              {...params}
              ref={mergeRefs(ref, params.ref)}
              helperText={isAdd && `Please add at least ${minStopCount} stops`}
            />
          )}
        />
      </Box>

      <input
        type="hidden"
        name={`${name}.coordinates`}
        value={value?.coordinates || ""}
      />

      <StopsListItemActions
        className="actions"
        stopIndex={stopIndex}
        fieldArray={fieldArray}
        disabled={disabled}
        sx={{ visibility: isAdd ? "hidden" : "visible" }}
      />
    </ListItem>
  );
}