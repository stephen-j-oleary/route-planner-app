"use server";

import { ApiGetRouteQuery, ApiGetRouteResponse, Leg, Stop } from "./schemas";
import radarClient from "@/utils/Radar";
import solveTsp from "@/utils/solveTsp";


export async function getRoute({ stops, origin, destination }: ApiGetRouteQuery) {
  const isRoundTrip = origin === destination;
  // Reorder coordinates for the tsp solver to handle origin and destination correctly
  const coordinates: Stop[] = [
    { originalIndex: origin, coordinates: stops[origin]!.split(",").map(item => +item) as [number, number] },
    ...stops.flatMap((value, originalIndex) => (originalIndex !== origin && originalIndex !== destination) ? [{ originalIndex, coordinates: value.split(",").map(item => +item) as [number, number] }] : []),
    ...(!isRoundTrip ? [{ originalIndex: destination, coordinates: stops[destination]!.split(",").map(item => +item) as [number, number] }] : []),
  ];

  // Get a distance matrix for the given stops
  const matrix = await radarClient.matrix({
    origins: coordinates.map(item => item.coordinates.join(",")).join("|"),
    destinations: coordinates.map(item => item.coordinates.join(",")).join("|"),
    units: "metric",
  });

  // Solve the tsp to get the optimal route;
  const { stopOrder } = solveTsp(matrix, { isRoundTrip });

  const directions = await radarClient.directions({
    locations: stopOrder.map(stop => coordinates[stop]!.coordinates.join(",")).join("|"),
    units: "metric",
  });
  if (!directions?.length) throw new Error("Failed to find directions");

  // Build the stopOrder and stops for the response using the original indexes from the request
  const resultStopOrder = [], resultStops = [];
  for (const stop of stopOrder) {
    resultStopOrder.push(coordinates[stop]!.originalIndex);
    resultStops.push(coordinates[stop]!);
  }

  // Create a legs array with information from the distance matrix
  const legs: Leg[] = Array(stopOrder.length - 1).fill(0);
  for (let i = 0; i < legs.length; ++i) {
    const stopNum = stopOrder[i]!;
    const nextStopNum = stopOrder[i + 1]!;
    const matrixVal = matrix[stopNum]![nextStopNum]!;

    legs[i] = {
      originIndex: matrixVal.originIndex,
      destinationIndex: matrixVal.destinationIndex,
      distance: matrixVal.distance.value,
      duration: matrixVal.duration.value,
      polyline: directions[0]!.legs[i]?.geometry.polyline || "",
    };
  }

  // Get the overall distance and duration of the entire route
  let distance = 0, duration = 0;
  for (const leg of legs) {
    distance += leg.distance;
    duration += leg.duration;
  }

  // Build the response object
  const data: ApiGetRouteResponse = {
    matrix,
    results: [{
      distance,
      duration,
      stopOrder: resultStopOrder,
      stops: resultStops,
      legs,
    }],
  };

  return data;
}