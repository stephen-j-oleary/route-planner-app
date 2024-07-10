import { array, InferType, object, string } from "yup";

import { deleteUserPaymentMethodById, getUserPaymentMethodById } from "./actions";


export const ApiGetUserPaymentMethodByIdQuerySchema = object()
  .shape({
    expand: array(string().required()).optional(),
  })
  .optional()
  .noUnknown();
export type ApiGetUserPaymentMethodByIdQuery = InferType<typeof ApiGetUserPaymentMethodByIdQuerySchema>;
export type ApiGetUserPaymentMethodByIdResponse = Awaited<ReturnType<typeof getUserPaymentMethodById>>;


export type ApiDeleteUserPaymentMethodByIdResponse = Awaited<ReturnType<typeof deleteUserPaymentMethodById>>;