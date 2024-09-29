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
  stopOrder: number[],
  orderedStops: string[],
  directions: DirectionsResponse["routes"][number],
}