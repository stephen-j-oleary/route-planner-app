import "client-only";

import dot from "dot-object";
import { isEmpty } from "lodash-es";

import { RouteFormSchema } from "./schema";
import { getGeocode } from "@/app/api/geocode/actions";
import { getRoute } from "@/app/api/route/actions";
import { TStop } from "@/models/Stop";
import { getSession } from "@/utils/auth/client";
import { parseCoordinate, stringifyCoordinate } from "@/utils/coords";


async function populateStops({
  stops,
  stopTime,
}: {
  stops: Partial<TStop>[],
  stopTime: number,
}) {
  const populatedStops: TStop[] = [];
  for (const stop of stops) {
    if (isEmpty(stop)) continue;

    const {
      fullText,
      mainText,
      duration,
    } = stop;
    if (!fullText) continue;

    const _coordinates = parseCoordinate(stop.coordinates || fullText);
    let coordinates = _coordinates && stringifyCoordinate(_coordinates);

    if (!coordinates) {
      const { results } = await getGeocode({ q: fullText })
        .catch((err) => {
          console.error(err);
          return ({ results: [] });
        });
      if (!results.length) continue; // Skip this item in the stops
      coordinates = results[0]?.coordinates;
    }

    if (!coordinates) continue;

    populatedStops.push({
      fullText,
      mainText,
      coordinates,
      duration: duration ?? stopTime,
    });
  }

  return populatedStops;
}

export async function createRoute(
  prevState: unknown,
  formData: FormData,
) {
  try {
    const {
      stops,
      origin,
      destination,
      stopTime,
    } = await RouteFormSchema.validate(
      dot.object(Object.fromEntries(formData))
    );

    const { user: { id: userId } = {} } = await getSession();
    if (!userId) throw new Error("Invalid session");

    const populatedStops = await populateStops({ stops, stopTime });

    const {
      stopOrder,
      orderedStops,
      matrix,
      directions,
    } = await getRoute({
      stops: populatedStops.map(({ coordinates }) => coordinates),
      origin,
      destination,
    })
      .catch(err => {
        console.error(err);
        throw new Error(err.response?.data?.message || err.message || "An error occurred");
      });

    return {
      route: {
        createdAt: new Date(),
        updatedAt: new Date(),
        userId,
        matrix,
        directions,
        stops: stopOrder.map((index, i) => ({ ...populatedStops[index], coordinates: orderedStops[i] })),
      },
    };
  }
  catch (err) {
    console.error(err);
    return {
      error: err instanceof Error ? err.message : "An error ocurred",
    };
  }
}