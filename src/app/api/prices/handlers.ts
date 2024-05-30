import { array, boolean, InferType, object, string } from "yup";

import stripeClientNext from "@/utils/stripeClient/next";


export const ApiGetPricesQuerySchema = object()
  .shape({
    active: boolean().optional(),
    product: string().optional(),
    expand: array(string().required()).optional(),
    lookup_keys: array(string().required()).optional(),
  })
  .optional()
  .noUnknown();
export type ApiGetPricesQuery = InferType<typeof ApiGetPricesQuerySchema>;
export type ApiGetPricesResponse = Awaited<ReturnType<typeof handleGetPrices>>;

export async function handleGetPrices(query: ApiGetPricesQuery) {
  const { data } = await stripeClientNext.prices.list(query);
  return data;
}