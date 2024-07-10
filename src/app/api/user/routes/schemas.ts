import { array, date, InferType, number, object, string, tuple } from "yup";

import { getUserRoutes, postUserRoute } from "./actions";


export type ApiGetUserRoutesResponse = Awaited<ReturnType<typeof getUserRoutes>>;


export const ApiPostUserRouteBodySchema = object()
  .shape({
    _id: string().optional(),
    editUrl: string().required(),
    distance: number().required().min(0),
    duration: number().required().min(0),
    stops: array(
      object({
        fullText: string().required(),
        mainText: string().optional(),
        coordinates: tuple([number().required(), number().required()]).required(),
        duration: number().required(),
      })
    ).required().min(2),
    legs: array(
      object({
        distance: number().required(),
        duration: number().required(),
        polyline: string().required(),
      })
    ).required().min(1),
    createdAt: date().optional(),
  })
  .required()
  .noUnknown();
export type ApiPostUserRouteData = InferType<typeof ApiPostUserRouteBodySchema>;
export type ApiPostUserRouteResponse = Awaited<ReturnType<typeof postUserRoute>>;