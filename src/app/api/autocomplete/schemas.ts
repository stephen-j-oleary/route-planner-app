import { InferType, number, object, string } from "yup";


export const ApiGetAutocompleteQuerySchema = object()
  .shape({
    q: string().required(),
    limit: number().optional(),
  })
  .required()
  .noUnknown();
export type ApiGetAutocompleteQuery = InferType<typeof ApiGetAutocompleteQuerySchema>;
export type ApiGetAutocompleteResponse = {
  results: {
    type: string,
    coordinates: string,
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
}