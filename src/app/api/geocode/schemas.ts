import { InferType, object, string } from "yup";


export const ApiGetGeocodeQuerySchema = object()
  .shape({
    q: string().required(),
    country: string().optional(),
  })
  .required()
  .noUnknown();
export type ApiGetGeocodeQuery = InferType<typeof ApiGetGeocodeQuerySchema>;