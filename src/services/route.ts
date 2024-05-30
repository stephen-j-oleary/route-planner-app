"use server";

import { cookies } from "next/headers";

import { ApiGetRouteQuery, ApiGetRouteResponse } from "@/app/api/route/route";
import fetchJson from "@/utils/fetchJson";
import pages from "pages";


export async function getRoute(params: ApiGetRouteQuery) {
  const res = await fetchJson(
    pages.api.route,
    {
      method: "GET",
      query: params,
      headers: { Cookie: cookies().toString() },
    },
  );
  const data = await res.json();

  if (!res.ok) throw data;

  return data as ApiGetRouteResponse;
}