import { array, InferType, number, object, string, tuple } from "yup";

import { deleteUserRouteById, getUserRouteById, patchUserRouteById } from "./actions";


export type ApiGetUserRouteByIdResponse = Awaited<ReturnType<typeof getUserRouteById>>;


export const ApiPatchUserRouteByIdBodySchema = object()
  .shape({
    editUrl: string().optional(),
    distance: number().optional().min(0),
    duration: number().optional().min(0),
    stops: array(
      object({
        fullText: string().required(),
        mainText: string().optional(),
        coordinates: tuple([number().required(), number().required()]).required(),
        duration: number().required(),
      })
    ).optional().min(2),
    legs: array(
      object({
        distance: number().required(),
        duration: number().required(),
        polyline: string().required(),
      })
    ).optional().min(1),
  })
  .required()
  .noUnknown();
export type ApiPatchUserRouteByIdData = InferType<typeof ApiPatchUserRouteByIdBodySchema>;
export type ApiPatchUserRouteByIdResponse = Awaited<ReturnType<typeof patchUserRouteById>>;


export type ApiDeleteUserRouteByIdResponse = Awaited<ReturnType<typeof deleteUserRouteById>>;