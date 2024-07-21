"use server";

import { isEmpty } from "lodash";
import { cookies } from "next/headers";
import dot from "dot-object";

import { getGeocode } from "@/app/api/geocode/actions";
import { getRoute } from "@/app/api/route/actions";
import { Stop } from "@/models/Route";
import { auth } from "@/utils/auth";
import { COORDINATES } from "@/utils/patterns";
import { RouteFormSchema } from "./schema";
import { ApiPostUserRouteData } from "@/app/api/user/routes/schemas";


export type RouteFormState = {
  route?: Omit<ApiPostUserRouteData, "editUrl"> & { userId: string },
  error?: string,
};


export async function createRoute(
  prevState: RouteFormState,
  formData: FormData,
): Promise<RouteFormState> {
  try {
    const parsedData = dot.object(Object.fromEntries(formData));

    const { stops, origin, destination, stopTime } =
      await RouteFormSchema.validate(parsedData);

    const { userId } = await auth(cookies());
    if (!userId) throw new Error("Must be logged in");

    const populatedStops: Stop[] = [];
    for (const stop of stops) {
      if (isEmpty(stop)) continue;

      const { fullText, mainText } = stop;
      let { coordinates, duration } = stop;

      if (!coordinates) {
        if (fullText.match(COORDINATES)) {
          coordinates = fullText.split(",").map(item => +(item.trim())) as [number, number];
        }
        else {
          const { results } = await getGeocode({ q: fullText })
            .catch(() => ({ results: [] }));
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

    return {
      route: {
        ...route,
        userId,
        stops: route.stops.map(stop => ({ ...populatedStops[stop.originalIndex]!, ...stop })),
      },
    };
  }
  catch (err) {
    return {
      error: err instanceof Error ? err.message : "An error ocurred",
    };
  }
}