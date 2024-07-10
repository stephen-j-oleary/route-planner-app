import { array, InferType, object, string } from "yup";

import { getUserPaymentMethods } from "./actions";


export const ApiGetUserPaymentMethodsQuerySchema = object()
  .shape({
    expand: array(string().required()).optional(),
  })
  .optional()
  .noUnknown();
export type ApiGetUserPaymentMethodsQuery = InferType<typeof ApiGetUserPaymentMethodsQuerySchema>;
export type ApiGetUserPaymentMethodsResponse = Awaited<ReturnType<typeof getUserPaymentMethods>>;