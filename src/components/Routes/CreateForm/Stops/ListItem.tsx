import "client-only";

import mergeRefs from "merge-refs";
import React from "react";
import { UseFieldArrayReturn } from "react-hook-form";

import { Box, ListItem } from "@mui/material";

import CreateRouteFormAddress from "../inputs/Address";
import { RouteFormFields } from "@/components/Routes/CreateForm/schema";
import StopsListItemActions from "@/components/Routes/CreateForm/Stops/ListItemActions";
import StopIcon from "@/components/Routes/StopIcons/Item";
import AddressAutocomplete from "@/components/ui/AddressAutocomplete";
import { AddressSuggestion } from "@/hooks/useAddressSuggestions";


export type StopsListItemProps = {
  name: string,
  value: AddressSuggestion | null,
  onChange: (v: AddressSuggestion | null) => void,
  onFocus?: (e: React.FocusEvent<HTMLElement>) => void,
  onBlur?: (e: React.FocusEvent<HTMLElement>) => void,
  stopIndex: number,
  isOrigin: boolean,
  isDestination: boolean,
  isAdd: boolean,
  fieldArray: UseFieldArrayReturn<RouteFormFields, "stops", "id">,
  disabled?: boolean,
};

const StopsListItem = React.forwardRef<HTMLElement, StopsListItemProps>(function StopsListItem({
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
}, ref) {
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
        isAdd={isAdd}
      />

      <Box flex="1 1 auto">
        <AddressAutocomplete
          autoSelect
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
            />
          )}
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