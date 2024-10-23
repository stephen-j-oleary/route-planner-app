import React from "react";

import { MyLocationRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

import { AddressAutocompleteSuggestionProps } from "../Suggestion";
import useGeolocation from "@/hooks/usePosition";
import { stringifyCoordinate } from "@/utils/coords";


export default function LocationQuickSuggestion({
  onChange,
}: AddressAutocompleteSuggestionProps) {
  const geolocation = useGeolocation();
  const [isGeolocating, startGeolocating] = React.useTransition();

  const handleClick = () => startGeolocating(
    async () => {
      try {
        const position = geolocation.position || await geolocation.request();
        const coordStr = stringifyCoordinate(position) ?? undefined;
        onChange?.({
          mainText: "Current location",
          fullText: coordStr,
          coordinates: coordStr,
        });
      }
      catch (err) {
        console.error(err);
      }
    }
  );

  return (
    <LoadingButton
      size="medium"
      variant="outlined"
      startIcon={<MyLocationRounded fontSize="inherit" />}
      loadingPosition="start"
      loading={isGeolocating}
      disabled={geolocation.state === "denied"}
      onClick={handleClick}
    >
      Current location
    </LoadingButton>
  );
}