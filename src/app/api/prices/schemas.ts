import { array, boolean, InferType, object, string } from "yup";

import { getPriceById, getPrices } from "./actions";


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
export type ApiGetPriceByIdResponse = Awaited<ReturnType<typeof getPriceById>>;


export const ApiGetPricesQuerySchema = object()
  .shape({
    id: string().optional(),
    active: boolean().optional(),
    product: string().optional(),
    expand: array(string().required()).optional(),
    lookup_keys: array(string().required()).optional(),
  })
  .required()
  .noUnknown();
export type ApiGetPricesQuery = InferType<typeof ApiGetPricesQuerySchema>;
export type ApiGetPricesResponse = Awaited<ReturnType<typeof getPrices>>;