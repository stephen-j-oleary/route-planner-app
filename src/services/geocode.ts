"use server";

import { cookies } from "next/headers";

import { ApiGetGeocodeQuery, ApiGetGeocodeResponse } from "@/app/api/geocode/handlers";
import fetchJson from "@/utils/fetchJson";
import pages from "pages";


export async function getGeocode(params: ApiGetGeocodeQuery) {
  const res = await fetchJson(
    pages.api.geocode,
    {
      method: "GET",
      query: params,
      headers: { Cookie: cookies().toString() },
    },
  );
  const data = await res.json();

  if (!res.ok) throw data;

  return data as ApiGetGeocodeResponse;
}