import { array, boolean, date, InferType, number, object, string } from "yup";

import { deleteUserSubscriptionById, getUserSubscriptionById, patchUserSubscriptionById } from "./actions";


export type ApiGetUserSubscriptionByIdResponse = Awaited<ReturnType<typeof getUserSubscriptionById>>;


export const ApiPatchUserSubscriptionByIdBodySchema = object()
  .shape({
    items: array(object({
      id: string().optional(),
      deleted: boolean().optional(),
      plan: string().optional(),
      price: string().optional(),
      quantity: number().optional(),
    })),
    cancel_at: date().optional(),
    cancel_at_period_end: boolean().optional(),
    default_payment_method: string().optional(),
  })
  .required()
  .noUnknown();
export type ApiPatchUserSubscriptionByIdBody = InferType<typeof ApiPatchUserSubscriptionByIdBodySchema>;
export type ApiPatchUserSubscriptionByIdResponse = Awaited<ReturnType<typeof patchUserSubscriptionById>>;


export type ApiDeleteUserSubscriptionByIdResponse = Awaited<ReturnType<typeof deleteUserSubscriptionById>>;