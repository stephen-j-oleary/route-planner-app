import { MyLocationRounded } from "@mui/icons-material";

import { AddressAutocompleteOption } from "./hooks";
import { useGeolocation } from "@/components/ui/Geolocation";
import { stringifyCoordinate } from "@/utils/coords";


export function useLocationQuickSuggestion(): AddressAutocompleteOption {
  const { get } = useGeolocation();

  return {
    mainText: "Current location",
    fullText: "",
    coordinates: "",
    icon: <MyLocationRounded fontSize="inherit" />,
    action: async () => {
      if (!get) return;

      const coordStr = stringifyCoordinate(await get()) ?? "";

      return {
        fullText: coordStr,
        coordinates: coordStr,
      };
    },
  };
}


export function useQuickSuggestions() {
  const location = useLocationQuickSuggestion();

  return [
    location,
  ];
}