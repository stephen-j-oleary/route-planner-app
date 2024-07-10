import { array, boolean, InferType, object, string } from "yup";

import { getPrices } from "./actions";


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
export type ApiGetPricesResponse = Awaited<ReturnType<typeof getPrices>>;