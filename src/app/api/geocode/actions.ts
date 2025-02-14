"use server";

import { filter, isEmpty } from "lodash-es";

import { ApiGetGeocodeQuery } from "./schemas";
import pages from "@/pages";
import auth from "@/utils/auth";
import radarClient from "@/utils/Radar";


export async function getIpGeocode() {
  return await radarClient.ipGeocode();
}

export async function getGeocode(params: ApiGetGeocodeQuery) {
  const {
    user: {
      countryCode = (await getIpGeocode()).address?.countryCode,
    } = {}
  } = await auth(pages.api.geocode).api();

  const res = await radarClient.geocode({
    query: params.q,
    country: countryCode,
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
    }),
  };
}