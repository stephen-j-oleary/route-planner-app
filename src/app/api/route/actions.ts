"use server";

import { ApiGetRouteQuery } from "./schemas";
import pages from "@/pages";
import auth from "@/utils/auth";
import radarClient from "@/utils/Radar";
import solveTsp, { Matrix } from "@/utils/solveTsp";


/**
 * @param stops An array of coordinate strings; "lat,lng"
 */
async function getMatrix(stops: string[]) {
  const matrix = await radarClient.matrix({
    origins: stops.join("|"),
    destinations: stops.join("|"),
    units: "metric",
  });
  if (!matrix?.length) throw new Error("Failed to get travel times");

  return matrix;
}

async function solveRoute({
  stops,
  matrix,
  origin,
  destination,
}: {
  /** An array of coordinate strings; "lat,lng" */
  stops: string[],
  /** The distance and travel time matrix */
  matrix: Matrix,
  /** The index of the origin in the stops array */
  origin: number,
  /** The index of the destination in the stops array */
  destination: number,
}) {
  const { stopOrder } = solveTsp(matrix, { origin, destination });
  const orderedStops = stopOrder.map(stop => stops[stop]);

  return {
    stopOrder,
    orderedStops,
  };
}

/**
 * @param stops An array of coordinate strings; "lat,lng"
 */
async function getDirections(stops: string[]) {
  const [directions] = await radarClient.directions({
    locations: stops.join("|"),
    units: "metric",
  });
  if (!directions) throw new Error("Failed to get directions");

  return directions;
}

export async function getRoute({ stops, origin, destination }: ApiGetRouteQuery) {
  await auth(pages.api.route).api();

  const matrix = await getMatrix(stops);
  const { stopOrder, orderedStops } = await solveRoute({ stops, matrix, origin, destination });
  const directions = await getDirections(orderedStops);

  // Build the response object
  return {
    matrix,
    stopOrder,
    orderedStops,
    directions,
  };
}