"use server";

import { filter, isEmpty } from "lodash-es";

import { ApiGetAutocompleteQuery, ApiGetAutocompleteResponse } from "./schemas";
import { getIpGeocode } from "@/app/api/geocode/actions";
import radarClient from "@/utils/Radar";


const DEFAULT_RESULT_LIMIT = 10;


export async function getAutocomplete(params: ApiGetAutocompleteQuery) {
  const { address: { latitude, longitude, countryCode } } = await getIpGeocode();
  const near = `${latitude},${longitude}`;

  // Load autocomplete results
  const res = await radarClient.autocomplete({
    query: params.q,
    near,
    countryCode,
    limit: params.limit ?? DEFAULT_RESULT_LIMIT,
  });

  // Format response
  const data: ApiGetAutocompleteResponse = {
    results: res.addresses.map(addr => {
      const { placeLabel, formattedAddress } = addr;
      const mainText = placeLabel || filter([addr.number, addr.street], v => !isEmpty(v)).join(" ");
      const secondaryText = placeLabel ? formattedAddress : filter([addr.city, addr.stateCode, addr.countryCode], v => !isEmpty(v)).join(", ");
      const fullText = placeLabel ?? filter([mainText, secondaryText], v => !isEmpty(v)).join(", ");

      return {
        type: addr.geometry.type,
        coordinates: `${addr.latitude},${addr.longitude}`,
        distance: addr.distance,
        mainText,
        secondaryText,
        fullText,
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
      };
    })
  };

  return data;
}