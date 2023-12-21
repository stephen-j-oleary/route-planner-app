import { ApiGetPaymentMethodsQuery, ApiGetPaymentMethodsResponse } from "@/pages/api/pay/paymentMethods";
import { ApiDeletePaymentMethodByIdResponse, ApiGetPaymentMethodByIdQuery, ApiGetPaymentMethodByIdResponse } from "@/pages/api/pay/paymentMethods/[id]";
import httpClient from "@/utils/httpClient";

const BASE_PATH = "api/pay/paymentMethods";


export type GetPaymentMethodsParams = ApiGetPaymentMethodsQuery;
export type GetPaymentMethodsReturn = Awaited<ReturnType<typeof getPaymentMethods>>;
export async function getPaymentMethods(params: GetPaymentMethodsParams = {}) {
  const { data } = await httpClient.request<ApiGetPaymentMethodsResponse>({
    method: "get",
    url: BASE_PATH,
    params,
  });

  return data;
}

export type GetPaymentMethodByIdParams = ApiGetPaymentMethodByIdQuery;
export type GetPaymentMethodByIdReturn = Awaited<ReturnType<typeof getPaymentMethodById>>;
export async function getPaymentMethodById(id: string, params: GetPaymentMethodByIdParams = {}) {
  if (!id) return null;

  const { data } = await httpClient.request<ApiGetPaymentMethodByIdResponse>({
    method: "get",
    url: `${BASE_PATH}/${id}`,
    params,
  });

  return data;
}


export type DeletePaymentMethodByIdReturn = Awaited<ReturnType<typeof deletePaymentMethodById>>;
export async function deletePaymentMethodById(id: string) {
  const { data } = await httpClient.request<ApiDeletePaymentMethodByIdResponse>({
    method: "delete",
    url: `${BASE_PATH}/${id}`,
  });

  return data;
}