"use client";

import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { useMemo } from "react";

import { Box, ListItem } from "@mui/material";

import useRouteForm from "../hooks";
import StopIcon, { StopIconProps } from "./Icon";
import CreateRouteFormAddress from "@/components/Routes/Form/inputs/Address";
import StopsListItemActions from "@/components/Routes/Form/Stops/ListItemActions";
import AddressAutocomplete from "@/components/ui/AddressAutocomplete";
import { AddressAutocompleteOption } from "@/components/ui/AddressAutocomplete/hooks";
import { useMapFocus } from "@/components/ui/Map/hooks";
import { TStop } from "@/models/Route";
import { parseCoordinate } from "@/utils/coords";


export type StopsListItemProps = {
  form: ReturnType<typeof useRouteForm>,
  name: string,
  value: Partial<AddressAutocompleteOption>,
  stopIndex: number,
  iconProps: StopIconProps,
};

export default function StopsListItem({
  form,
  name,
  value,
  stopIndex,
  iconProps,
}: StopsListItemProps) {
  const coord = useMemo(
    () => parseCoordinate(value?.coordinates || value?.fullText),
    [value]
  );

  useMapFocus([coord]);

  const onChange = (v: Partial<TStop>) => form.updateStop(stopIndex, v);
  const onRemove = () => form.removeStop(stopIndex);

  return (
    <ListItem
      sx={{
        gap: 1,
        backgroundColor: "background.paper",
        p: 0,
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

      <Box flex="1 1 auto" py={1}>
        <AddressAutocomplete
          value={value}
          onChange={onChange}
          coord={coord}
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