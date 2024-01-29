import { ApiGetProductsQuery, ApiGetProductsResponse } from "@/pages/api/products";
import { ApiGetProductByIdResponse } from "@/pages/api/products/[id]";
import httpClient from "@/utils/httpClient";

const BASE_PATH = "api/products";


export type GetProductsParams = ApiGetProductsQuery;
export type GetProductsReturn = ReturnType<typeof getProducts>;

export async function getProducts(params: GetProductsParams = {}) {
  const { data } = await httpClient.request<ApiGetProductsResponse>({
    method: "get",
    url: BASE_PATH,
    params,
  });

  return data;
}


export type GetProductByIdReturn = Awaited<ReturnType<typeof getProductById>>;

export async function getProductById(id: string) {
  const { data } = await httpClient.request<ApiGetProductByIdResponse>({
    method: "get",
    url: `${BASE_PATH}/${id}`,
  });

  return data;
}