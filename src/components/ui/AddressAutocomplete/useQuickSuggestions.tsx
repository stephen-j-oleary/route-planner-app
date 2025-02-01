import { MyLocationRounded } from "@mui/icons-material";

import { useGeolocation } from "@/components/ui/Geolocation";
import { stringifyCoordinate } from "@/utils/coords";


export function useLocationQuickSuggestion() {
  const { get } = useGeolocation();

  return {
    key: "location",
    mainText: "Current location",
    icon: <MyLocationRounded />,
    action: async () => {
      if (!get) return;

      const coordStr = stringifyCoordinate(await get()) ?? undefined;

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