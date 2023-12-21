import { ApiGetPricesQuery, ApiGetPricesResponse } from "@/pages/api/pay/prices";
import { ApiGetPriceQuery, ApiGetPriceResponse } from "@/pages/api/pay/prices/[id]";
import httpClient from "@/utils/httpClient";

const BASE_PATH = "api/pay/prices";


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

export type GetPriceByIdParams = Omit<ApiGetPriceQuery, "id">;
export type GetPriceByIdReturn = ReturnType<typeof getPriceById>;

export async function getPriceById(id: string, params: GetPriceByIdParams = {}) {
  if (!id) return null;

  const { data } = await httpClient.request<ApiGetPriceResponse>({
    method: "get",
    url: `${BASE_PATH}/${id}`,
    params,
  });

  return data;
}