import { InferType, object, string } from "yup";


export const ApiGetGeocodeQuerySchema = object()
  .shape({
    q: string().required(),
    country: string().optional(),
  })
  .required()
  .noUnknown();
export type ApiGetGeocodeQuery = InferType<typeof ApiGetGeocodeQuerySchema>;
export type ApiGetGeocodeResponse = {
  results: {
    type: string,
    coordinates: [number, number],
    distance: number,
    fullText: string,
    mainText: string,
    secondaryText?: string,
    number: string,
    street: string,
    neighborhood: string,
    city: string,
    county: string,
    postalCode: string,
    state: string,
    stateCode: string,
    country: string,
    countryCode: string,
  }[]
};