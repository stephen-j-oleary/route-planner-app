import "client-only";

import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { useMemo } from "react";

import { Box, ListItem } from "@mui/material";

import useRouteForm from "../hooks";
import CreateRouteFormAddress from "@/components/Routes/CreateForm/inputs/Address";
import StopsListItemActions from "@/components/Routes/CreateForm/Stops/ListItemActions";
import StopIcon, { StopIconProps } from "@/components/Routes/StopIcons/Item";
import AddressAutocomplete from "@/components/ui/AddressAutocomplete";
import { AddressAutocompleteOption } from "@/components/ui/AddressAutocomplete/hooks";
import LocationQuickSuggestion from "@/components/ui/AddressAutocomplete/quick/Location";
import { useMapFocus } from "@/components/ui/Map/hooks";
import { parseCoordinate } from "@/utils/coords";


export type StopsListItemProps = {
  form: ReturnType<typeof useRouteForm>,
  name: string,
  value: Partial<AddressAutocompleteOption>,
  onChange: (v: Partial<AddressAutocompleteOption>) => void,
  onRemove: () => void,
  stopIndex: number,
  iconProps: StopIconProps,
};

export default function StopsListItem({
  form,
  name,
  value,
  onChange,
  onRemove,
  stopIndex,
  iconProps,
}: StopsListItemProps) {
  const coord = useMemo(
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

      <StopIcon {...iconProps} />

      <Box flex="1 1 auto">
        <AddressAutocomplete
          value={value}
          onChange={onChange}
          quickSuggestions={[
            { key: "location", Component: LocationQuickSuggestion },
          ]}
          renderInput={params => (
            <CreateRouteFormAddress
              {...params}
              name={`${name}.fullText`}
              placeholder="Add a stop"
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
        form={form}
        stopIndex={stopIndex}
        onChange={onChange}
        onRemove={onRemove}
        className="actions"
      />
    </ListItem>
  );
}