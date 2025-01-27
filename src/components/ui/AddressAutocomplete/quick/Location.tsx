import { MyLocationRounded } from "@mui/icons-material";
import { Button } from "@mui/material";

import { AddressAutocompleteSuggestionProps } from "../Suggestion";
import useGeolocation from "@/hooks/useGeolocation";
import { stringifyCoordinate } from "@/utils/coords";


export default function LocationQuickSuggestion({
  onChange,
}: AddressAutocompleteSuggestionProps) {
  const { result } = useGeolocation();

  const handleClick = () => {
    if (!result?.lat) return;

    const coordStr = stringifyCoordinate(result) ?? undefined;

    onChange?.({
      mainText: "Current location",
      fullText: coordStr,
      coordinates: coordStr,
    });
  };

  return (
    <Button
      size="medium"
      variant="outlined"
      startIcon={<MyLocationRounded fontSize="inherit" />}
      disabled={!result?.lat}
      onClick={handleClick}
    >
      Current location
    </Button>
  );
}