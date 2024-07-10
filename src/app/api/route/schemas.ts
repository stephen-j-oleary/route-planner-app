import { array, InferType, number, object, string } from "yup";

import { COORDINATES } from "@/utils/patterns";
import { Matrix } from "@/utils/solveTsp";


export type Stop = {
  /** The coordinates of the stop */
  coordinates: [number, number],
  /** The original index (from the request) of the stop */
  originalIndex: number,
};

export type Leg = {
  distance: number,
  duration: number,
  originIndex: number,
  destinationIndex: number,
  polyline: string,
};


export const ApiGetRouteQuerySchema = object()
  .shape({
    stops: array()
      .of(string().required().matches(COORDINATES))
      .required()
      .min(3)
      .when("$isCustomer", ([isCustomer], schema) => {
        const maxValue = isCustomer ? 100 : 10;
        return schema.max(maxValue, `Too many stops. The maximum is ${maxValue}`);
      }),
    origin: number()
      .required()
      .min(0)
      .test(
        "max",
        "Origin must be an index of stops",
        (value, ctx) => value < ctx.parent.stops.length,
      ),
    destination: number()
      .required()
      .min(0)
      .test(
        "max",
        "Destination must be an index of stops",
        (value, ctx) => value < ctx.parent.stops.length,
      ),
  });
export type ApiGetRouteQuery = InferType<typeof ApiGetRouteQuerySchema>;
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