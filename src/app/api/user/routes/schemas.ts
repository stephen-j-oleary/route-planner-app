import { array, date, InferType, number, object, string } from "yup";

import { getUserRoutes, postUserRoute } from "./actions";
import { COORDINATE_PATTERN } from "@/utils/coords";


export type ApiGetUserRoutesResponse = Awaited<ReturnType<typeof getUserRoutes>>;


export const ApiPostUserRouteBodySchema = object()
  .shape({
    _id: string().optional(),
    editUrl: string().required(),
    matrix: array()
      .of(
        array().of(
          object().shape({
            duration: object().shape({ value: number() }),
            distance: object().shape({ value: number() }),
          })
        )
      )
      .optional()
      .default(undefined),
    stops: array(
      object({
        fullText: string().required(),
        mainText: string().optional(),
        coordinates: string().required().matches(COORDINATE_PATTERN),
        duration: number().optional(),
      })
    ).required().min(2),
    directions: object()
      .shape({
        distance: object().shape({ value: number().required().min(0) }),
        duration: object().shape({ value: number().required().min(0) }),
        legs: array(
          object({
            distance: object().shape({ value: number().required() }),
            duration: object().shape({ value: number().required() }),
            geometry: object().shape({ polyline: string().required() }),
          })
        ).required().min(1),
      })
      .required(),
    createdAt: date().optional(),
  })
  .required()
  .noUnknown();

export type ApiPostUserRouteData = InferType<typeof ApiPostUserRouteBodySchema>;
export type ApiPostUserRouteResponse = Awaited<ReturnType<typeof postUserRoute>>;