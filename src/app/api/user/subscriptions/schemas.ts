import { array, InferType, object, string } from "yup";

import { getUserSubscriptions } from "./actions";


export const ApiGetUserSubscriptionsQuerySchema = object()
  .shape({
    expand: array(string().required()).optional(),
    plan: string().optional(),
    price: string().optional(),
  })
  .optional()
  .noUnknown();
export type ApiGetUserSubscriptionsQuery = InferType<typeof ApiGetUserSubscriptionsQuerySchema>;
export type ApiGetUserSubscriptionsResponse = Awaited<ReturnType<typeof getUserSubscriptions>>;