import { array, InferType, object, string } from "yup";

import { getPriceById } from "./actions";


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