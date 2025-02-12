"use server";

import dot from "dot-object";
import { isEmpty } from "lodash-es";

import { RouteFormSchema } from "./schema";
import { getGeocode } from "@/app/api/geocode/actions";
import { getRoute } from "@/app/api/route/actions";
import { IRoute, Stop } from "@/models/Route";
import pages from "@/pages";
import auth from "@/utils/auth";
import { parseCoordinate, stringifyCoordinate } from "@/utils/coords";


export type RouteFormState = {
  route?: Omit<IRoute, "_id">,
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

    const { user: { id: userId } = {} } = await auth(pages.routes.new).api();
    if (!userId) throw new Error("Must be logged in");

    const populatedStops: Stop[] = [];
    for (const stop of stops) {
      if (isEmpty(stop)) continue;

      const { fullText, mainText } = stop;
      let { duration } = stop;

      const _coordinates = parseCoordinate(stop.coordinates || stop.fullText);
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

      duration ??= stopTime;

      populatedStops.push({ fullText, mainText, coordinates, duration });
    }

    const { stopOrder, orderedStops, matrix, directions } = await getRoute({ stops: populatedStops.map(({ coordinates }) => coordinates), origin, destination })
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
        stops: stopOrder.map((index, i) => ({ ...populatedStops[index]!, coordinates: orderedStops[i] })),
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