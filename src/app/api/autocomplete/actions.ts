"use server";

import { filter, isEmpty } from "lodash-es";

import { ApiGetAutocompleteQuery, ApiGetAutocompleteResponse } from "./schemas";
import radarClient from "@/utils/Radar";


const DEFAULT_RESULT_LIMIT = 10;


export async function getAutocomplete(params: ApiGetAutocompleteQuery) {
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