import { filter, isEmpty } from "lodash";
import { InferType, object, string } from "yup";

import radarClient from "@/utils/Radar";


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

export async function handleGetGeocode(params: ApiGetGeocodeQuery) {
  const res = await radarClient.geocode({
    query: params.q,
    country: params.country,
  });

  const data: ApiGetGeocodeResponse = {
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
    })),
  };

  return data;
}