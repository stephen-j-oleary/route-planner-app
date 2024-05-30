import { array, boolean, InferType, object, string } from "yup";

import stripeClientNext from "@/utils/stripeClient/next";


export const ApiGetProductsQuerySchema = object()
  .shape({
    active: boolean().optional(),
    expand: array(string().required()).optional(),
  })
  .optional()
  .noUnknown();
export type ApiGetProductsQuery = InferType<typeof ApiGetProductsQuerySchema>;
export type ApiGetProductsResponse = Awaited<ReturnType<typeof handleGetProducts>>;

export async function handleGetProducts(params: ApiGetProductsQuery = {}) {
  const { data } = await stripeClientNext.products.list(params);
  return data;
}