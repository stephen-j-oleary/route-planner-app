import { array, InferType, object, string } from "yup";

import stripeClientNext from "@/utils/stripeClient/next";


export const ApiGetPriceByIdQuerySchema = object()
  .shape({
    expand: array()
      .typeError("Invalid expand")
      .of(string().required("Invalid expand"))
      .optional(),
  })
  .optional()
  .noUnknown();
export type ApiGetPriceByIdQuery = InferType<typeof ApiGetPriceByIdQuerySchema>;
export type ApiGetPriceByIdResponse = Awaited<ReturnType<typeof handleGetPriceById>>;

export async function handleGetPriceById(id: string, params: ApiGetPriceByIdQuery = {}) {
  return await stripeClientNext.prices.retrieve(id, params);
}