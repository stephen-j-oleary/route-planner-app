import "client-only";

import { ApiGetPriceByIdQuery, ApiGetPriceByIdResponse } from "@/app/api/prices/[id]/handlers";
import { ApiGetPricesQuery, ApiGetPricesResponse } from "@/app/api/prices/handlers";
import fetchJson from "@/utils/fetchJson";
import pages from "pages";


export async function getPrices(params: ApiGetPricesQuery = {}) {
  return await fetchJson<ApiGetPricesResponse>(
    pages.api.prices,
    {
      method: "GET",
      query: params,
    },
  );
}


export async function getPriceById(id: string, params: ApiGetPriceByIdQuery = {}) {
  return await fetchJson<ApiGetPriceByIdResponse>(
    `${pages.api.prices}/${id}`,
    {
      method: "GET",
      query: params,
    },
  );
}