import { array, InferType, number, object, string } from "yup";

import { deleteUserRouteById, getUserRouteById, patchUserRouteById } from "./actions";
import { COORDINATE_PATTERN } from "@/utils/coords";


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
        coordinates: string().required().matches(COORDINATE_PATTERN),
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