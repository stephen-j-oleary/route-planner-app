import { array, boolean, InferType, object, string } from "yup";

import { getProducts } from "./actions";


export const ApiGetProductsQuerySchema = object()
  .shape({
    active: boolean().optional(),
    expand: array(string().required()).optional(),
  })
  .optional()
  .noUnknown();
export type ApiGetProductsQuery = InferType<typeof ApiGetProductsQuerySchema>;
export type ApiGetProductsResponse = Awaited<ReturnType<typeof getProducts>>;