"use server";

import { cookies } from "next/headers";

import { ApiGetRouteQuery, ApiGetRouteResponse } from "@/app/api/route/route";
import fetchJson from "@/utils/fetchJson";
import pages from "pages";


export async function getRoute(params: ApiGetRouteQuery) {
  return await fetchJson<ApiGetRouteResponse>(
    pages.api.route,
    {
      method: "GET",
      query: params,
      headers: { Cookie: cookies().toString() },
    },
  );
}