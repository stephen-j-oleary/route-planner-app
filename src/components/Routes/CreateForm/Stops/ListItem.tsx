import "client-only";

import mergeRefs from "merge-refs";
import React from "react";
import { UseFieldArrayReturn } from "react-hook-form";

import { Box, ListItem } from "@mui/material";

import CreateRouteFormAddress from "../inputs/Address";
import StopsListItemActions from "@/components/Routes/CreateForm/Stops/ListItemActions";
import { CreateRouteFormFields } from "@/components/Routes/CreateForm/useLogic";
import StopIcon from "@/components/Routes/StopIcons/Item";
import AddressAutocomplete from "@/components/ui/AddressAutocomplete";
import { AddressSuggestion } from "@/hooks/useAddressSuggestions";


export type StopsListItemProps = {
  value: AddressSuggestion | null,
  onChange: (v: AddressSuggestion | null) => void,
  onFocus?: (e: React.FocusEvent<HTMLElement>) => void,
  onBlur?: (e: React.FocusEvent<HTMLElement>) => void,
  stopIndex: number,
  isOrigin: boolean,
  isDestination: boolean,
  fieldArray: UseFieldArrayReturn<CreateRouteFormFields, "stops", "id">,
  disabled?: boolean,
};

const StopsListItem = React.forwardRef<HTMLElement, StopsListItemProps>(function StopsListItem({
  value,
  onChange,
  onFocus,
  onBlur,
  stopIndex,
  isOrigin,
  isDestination,
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