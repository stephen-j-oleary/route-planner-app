import { filter, isEmpty } from "lodash";
import { InferType, number, object, string } from "yup";

import radarClient from "@/utils/Radar";


const DEFAULT_RESULT_LIMIT = 10;


export const ApiGetAutocompleteQuerySchema = object()
  .shape({
    q: string().required(),
    location: string().optional(),
    limit: number().optional(),
  })
  .required()
  .noUnknown();
export type ApiGetAutocompleteQuery = InferType<typeof ApiGetAutocompleteQuerySchema>;
export type ApiGetAutocompleteResponse = {
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
}

export async function handleGetAutocomplete(params: ApiGetAutocompleteQuery) {
  const res = await radarClient.autocomplete({
    query: params.q,
    near: params.location,
    limit: params.limit ?? DEFAULT_RESULT_LIMIT,
  });

  const data: ApiGetAutocompleteResponse = {
    results: res.addresses.map(addr => ({
      type: addr.geometry.type,
      coordinates: [addr.latitude, addr.longitude],
      distance: addr.distance,
      mainText: addr.placeLabel || filter([addr.number, addr.street], v => !isEmpty(v)).join(" "),
      secondaryText: addr.placeLabel ? addr.formattedAddress : filter([addr.city, addr.stateCode, addr.countryCode], v => !isEmpty(v)).join(", "),
      fullText: addr.formattedAddress,
      number: addr.number,
      street: addr.street,
      neighborhood: addr.neighborhood,
      city: addr.city,
      county: addr.county,
      postalCode: addr.postalCode,
      state: addr.state,
      stateCode: addr.stateCode,
      country: addr.country,
      countryCode: addr.countryCode,
    }))
  };
  return data;
}