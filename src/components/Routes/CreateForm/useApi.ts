import "client-only";

import { isEmpty } from "lodash-es";
import { usePathname } from "next/navigation";

import { getGeocode } from "@/app/api/geocode/actions";
import { getRoute } from "@/app/api/route/actions";
import { Stop } from "@/models/Route";
import { createLocalRoute } from "@/services/localRoutes";
import { COORDINATES } from "@/utils/patterns";


export type HandleSubmitData = {
  origin: number,
  destination: number,
  stopTime: number,
  stops: (Pick<Stop, "fullText"> & Partial<Omit<Stop, "fullText">>)[],
}

export default function useCreateRouteFormApi() {
  const pathname = usePathname();

  const handleSubmit = async (formData: HandleSubmitData) => {
    const { stops, origin, destination, stopTime } = formData;

    const populatedStops: Stop[] = [];
    for (const stop of stops) {
      if (isEmpty(stop)) continue;

      const { fullText, mainText } = stop;
      let { coordinates, duration } = stop;

      if (!coordinates) {
        if (fullText.match(COORDINATES)) {
          coordinates = stop.fullText.split(",").map(item => +(item.trim())) as [number, number];
        }
        else {
          const { results } = await getGeocode({ q: fullText }).catch(err => {
            console.error(err);
            return { results: [] };
          });
          if (!results.length) continue; // Skip this item in the stops
          coordinates = results[0]!.coordinates;
        }
      }

      duration ??= stopTime;

      populatedStops.push({ fullText, mainText, coordinates, duration });
    }

    const { results } = await getRoute({ stops: populatedStops.map(({ coordinates: [lat, lng]}) => `${lat},${lng}`), origin, destination })
      .catch(err => {
        throw new Error(err.response?.data?.message || err.message || "An error occurred");
      });
    if (!results?.length) throw new Error("No routes found");

    // Get the first result
    const { stopOrder, ...route } = results[0]!;

    try {
      const { _id } = await createLocalRoute({
        ...route,
        editUrl: pathname || "",
        stops: route.stops.map(stop => ({ ...populatedStops[stop.originalIndex]!, ...stop })),
      });

      return _id;
    }
    catch (err) {
      console.error(err);
      throw err;
    }
  };

  return {
    onSubmit: handleSubmit,
  };
}