"use server";

import { cookies } from "next/headers";

import { ApiGetPriceByIdQuery, ApiGetPriceByIdResponse } from "@/app/api/prices/[id]/handlers";
import { ApiGetPricesQuery, ApiGetPricesResponse } from "@/app/api/prices/handlers";
import fetchJson from "@/utils/fetchJson";
import pages from "pages";


export async function getPrices(params: ApiGetPricesQuery = {}) {
  const res = await fetchJson(
    pages.api.prices,
    {
      method: "GET",
      query: params,
      headers: { Cookie: cookies().toString() },
    },
  );
  const data = await res.json();

  if (!res.ok) throw data;

  return data as ApiGetPricesResponse;
}


export async function getPriceById(id: string, params: ApiGetPriceByIdQuery = {}) {
  const res = await fetchJson(
    `${pages.api.prices}/${id}`,
    {
      method: "GET",
      query: params,
      headers: { Cookie: cookies().toString() },
    },
  );
  const data = await res.json();

  if (!res.ok) throw data;

  return data as ApiGetPriceByIdResponse;
}