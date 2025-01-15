import { array, InferType, number, object, string } from "yup";

import { COORDINATE_PATTERN } from "@/utils/coords";
import { DirectionsResponse } from "@/utils/Radar";
import { Matrix } from "@/utils/solveTsp";


export const ApiGetRouteQuerySchema = object()
  .shape({
    stops: array()
      .of(string().required().matches(COORDINATE_PATTERN))
      .required()
      .min(3)
      .when(
        "$maxStops",
        ([maxStops], schema) => schema.max(maxStops, `Too many stops. The maximum is ${maxStops}`),
      ),
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
  stopOrder: number[],
  orderedStops: string[],
  directions: DirectionsResponse["routes"][number],
}