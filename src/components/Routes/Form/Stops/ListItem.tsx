"use client";

import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { useMemo, useState } from "react";

import { ArrowBackIosRounded } from "@mui/icons-material";
import { Box, IconButton, ListItem, useMediaQuery } from "@mui/material";

import useRouteForm from "../hooks";
import StopIcon, { StopIconProps } from "./Icon";
import CreateRouteFormAddress from "@/components/Routes/Form/inputs/Address";
import StopsListItemActions from "@/components/Routes/Form/Stops/ListItemActions";
import AddressAutocomplete from "@/components/ui/AddressAutocomplete";
import { AddressAutocompleteOption } from "@/components/ui/AddressAutocomplete/hooks";
import { useMapFocus } from "@/components/ui/Map/hooks";
import { TStop } from "@/models/Stop";
import { parseCoordinate } from "@/utils/coords";


export type StopsListItemProps = {
  form: ReturnType<typeof useRouteForm>,
  name: string,
  value: AddressAutocompleteOption,
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
  const isMobile = useMediaQuery("@media only screen and (hover: none) and (pointer: coarse)");

  const [open, setOpen] = useState(false);

  const coord = useMemo(
    () => parseCoordinate(value?.coordinates || value?.fullText),
    [value]
  );

  useMapFocus([coord]);

  const onChange = (v: Partial<TStop>) => form.updateStop(stopIndex, v as (Partial<Omit<TStop, "fullText">> & Required<Pick<TStop, "fullText">>));
  const onRemove = () => form.removeStop(stopIndex);

  return (
    <ListItem
      sx={{
        gap: 1,
        p: 0,
        position: "static",
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

      <Box
        flex="1 1 auto"
        sx={{
          position:
            !open
              ? "relative"
              : isMobile
              ? "fixed"
              : "absolute",
          inset: "env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)",
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          gridTemplateRows: "auto 1fr",
          gridTemplateAreas: `
            "icon input action"
            "suggestions suggestions suggestions"
          `,
          backgroundColor: open ? "background.paper" : "inherit",
          zIndex: open ? theme => theme.zIndex.modal : "unset",
        }}
      >
        <Box
          pl={1}
          alignSelf="stretch"
          display="flex"
        >
          {
            open
              ? (
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => setOpen(false)}
                  sx={{ alignSelf: "center" }}
                >
                  <ArrowBackIosRounded fontSize="inherit" />
                </IconButton>
              )
              : <StopIcon {...iconProps} />
          }
        </Box>

        <AddressAutocomplete
          value={value}
          onChange={onChange}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          coord={coord}
          renderInput={params => (
            <CreateRouteFormAddress
              {...params}
              name={`${name}.fullText`}
              placeholder="Enter an address or click on the map"
              sx={{ p: 1 }}
            />
          )}
        />

        {
          !open && (
            <StopsListItemActions
              form={form}
              stopIndex={stopIndex}
              onChange={onChange}
              onRemove={onRemove}
              className="actions"
              sx={{
                gridArea: "action",
                alignSelf: "center",
                pr: 1,
              }}
            />
          )
        }
      </Box>

      <input
        type="hidden"
        name={`${name}.coordinates`}
        value={value?.coordinates || ""}
      />
    </ListItem>
  );
}