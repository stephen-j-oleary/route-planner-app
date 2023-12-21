import { ApiGetProductsQuery, ApiGetProductsResponse } from "@/pages/api/pay/products";
import { ApiGetProductByIdQuery, ApiGetProductByIdResponse } from "@/pages/api/pay/products/[id]";
import httpClient from "@/utils/httpClient";

const BASE_PATH = "api/pay/products";


export type GetProductsParams = ApiGetProductsQuery;
export type GetProductsReturn = Awaited<ReturnType<typeof getProducts>>;

export async function getProducts(params: GetProductsParams = {}) {
  const { data } = await httpClient.request<ApiGetProductsResponse>({
    method: "get",
    url: BASE_PATH,
    params,
  });

  return data;
}

export type GetProductByIdParams = Omit<ApiGetProductByIdQuery, "id">;
export type GetProductByIdReturn = Awaited<ReturnType<typeof getProductById>>;

export async function getProductById(id: string, params: GetProductByIdParams = {}) {
  const { data } = await httpClient.request<ApiGetProductByIdResponse>({
    method: "get",
    url: `${BASE_PATH}/${id}`,
    params,
  });

  return data;
}