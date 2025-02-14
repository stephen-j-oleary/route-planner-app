"use server";

import { filter, isEmpty } from "lodash-es";

import { ApiGetAutocompleteQuery } from "./schemas";
import { getIpGeocode } from "@/app/api/geocode/actions";
import pages from "@/pages";
import auth from "@/utils/auth";
import radarClient from "@/utils/Radar";


const DEFAULT_RESULT_LIMIT = 10;


export async function getAutocomplete(params: ApiGetAutocompleteQuery) {
  const {
    user: {
      countryCode = (await getIpGeocode()).address?.countryCode,
    } = {}
  } = await auth(pages.api.autocomplete).api();

  // Load autocomplete results
  const res = await radarClient.autocomplete({
    query: params.q,
    countryCode,
    limit: params.limit ?? DEFAULT_RESULT_LIMIT,
  });

  return {
    results: res.addresses.map(({
      geometry,
      latitude,
      longitude,
      placeLabel,
      formattedAddress,
      ...addr
    }) => {
      const mainText = placeLabel || filter([addr.number, addr.street], v => !isEmpty(v)).join(" ");
      const secondaryText = placeLabel ? formattedAddress : filter([addr.city, addr.stateCode, addr.countryCode], v => !isEmpty(v)).join(", ");
      const fullText = placeLabel ?? filter([mainText, secondaryText], v => !isEmpty(v)).join(", ");

      return {
        type: geometry.type,
        coordinates: `${latitude},${longitude}`,
        mainText,
        secondaryText,
        fullText,
        ...addr,
      };
    })
  };
}