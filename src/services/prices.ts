import { ApiGetPricesQuery, ApiGetPricesResponse } from "@/pages/api/prices";
import { ApiGetPriceByIdQuery, ApiGetPriceByIdResponse } from "@/pages/api/prices/[id]";
import httpClient from "@/utils/httpClient";

const BASE_PATH = "api/prices";


export type GetPricesParams = ApiGetPricesQuery;
export type GetPricesReturn = ReturnType<typeof getPrices>;

export async function getPrices(params: GetPricesParams = {}) {
  const { data } = await httpClient.request<ApiGetPricesResponse>({
    method: "get",
    url: BASE_PATH,
    params,
  });

  return data;
}


export type GetPriceByIdParams = ApiGetPriceByIdQuery;
export type GetPriceByIdReturn = ReturnType<typeof getPriceById>;

export async function getPriceById(id: string | undefined, params: GetPriceByIdParams = {}) {
  if (!id) return null;

  const { data } = await httpClient.request<ApiGetPriceByIdResponse>({
    method: "get",
    url: `${BASE_PATH}/${id}`,
    params,
  });

  return data;
}