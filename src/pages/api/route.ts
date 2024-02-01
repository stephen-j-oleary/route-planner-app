import { array, InferType, number, object, string } from "yup";

import nextConnect from "@/nextConnect";
import authorization from "@/nextConnect/middleware/authorization";
import validation, { ValidatedType } from "@/nextConnect/middleware/validation";
import { COORDINATES } from "@/utils/patterns";
import radarClient from "@/utils/Radar";
import solveTsp, { Matrix } from "@/utils/solveTsp";


const handler = nextConnect();


type Stop = {
  /** The coordinates of the stop */
  coordinates: [number, number],
  /** The original index (from the request) of the stop */
  originalIndex: number,
};

type Leg = {
  distance: number,
  duration: number,
  originIndex: number,
  destinationIndex: number,
  polyline: string,
};

const ApiGetRouteSchema = object({
  query: object({
    stops: array(
      string().required().matches(COORDINATES),
    ).required().min(3),
    origin: number().required(),
    destination: number().required(),
  }),
});
export type ApiGetRouteQuery = InferType<typeof ApiGetRouteSchema>["query"];
export type ApiGetRouteResponse = {
  matrix: Matrix,
  results: {
    /** The route distance */
    distance: number,
    /** The route duration in minutes */
    duration: number,
    /** The stops of the route in the optimized order */
    stops: Stop[];
    /** The legs of the route */
    legs: Leg[],
    /** The order of the stops */
    stopOrder: number[],
  }[],
}
export async function handleGetRoute({ stops, origin, destination }: ApiGetRouteQuery) {
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

handler.get(
  authorization({ isSubscriber: true }),
  validation(ApiGetRouteSchema),
  async (req, res) => {
    const { query } = req.locals.validated as ValidatedType<typeof ApiGetRouteSchema>;

    const data = await handleGetRoute(query);
    res.status(200).json(data);
  }
);

export default handler;