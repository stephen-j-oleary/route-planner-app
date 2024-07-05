import "client-only";

import { ApiGetGeocodeQuery, ApiGetGeocodeResponse } from "@/app/api/geocode/handlers";
import fetchJson from "@/utils/fetchJson";
import pages from "pages";


export async function getGeocode(params: ApiGetGeocodeQuery) {
  return await fetchJson<ApiGetGeocodeResponse>(
    pages.api.geocode,
    {
      method: "GET",
      query: params,
    },
  );
}