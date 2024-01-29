import { ApiGetUserPaymentMethodsQuery, ApiGetUserPaymentMethodsResponse } from "@/pages/api/user/paymentMethods";
import { ApiDeleteUserPaymentMethodByIdResponse, ApiGetUserPaymentMethodByIdQuery, ApiGetUserPaymentMethodByIdResponse } from "@/pages/api/user/paymentMethods/[id]";
import httpClient from "@/utils/httpClient";

const BASE_PATH = "api/user/paymentMethods";


export type GetUserPaymentMethodsParams = ApiGetUserPaymentMethodsQuery;
export type GetUserPaymentMethodsReturn = ReturnType<typeof getUserPaymentMethods>;

export async function getUserPaymentMethods(params: GetUserPaymentMethodsParams = {}) {
  const { data } = await httpClient.request<ApiGetUserPaymentMethodsResponse>({
    method: "get",
    url: BASE_PATH,
    params,
  });

  return data;
}


export type GetUserPaymentMethodByIdParams = ApiGetUserPaymentMethodByIdQuery;
export type GetUserPaymentMethodByIdReturn = ReturnType<typeof getUserPaymentMethodById>;

export async function getUserPaymentMethodById(id: string | undefined, params: GetUserPaymentMethodByIdParams = {}) {
  if (!id) return null;

  const { data } = await httpClient.request<ApiGetUserPaymentMethodByIdResponse>({
    method: "get",
    url: `${BASE_PATH}/${id}`,
    params,
  });

  return data;
}


export type DeleteUserPaymentMethodByIdReturn = ReturnType<typeof deleteUserPaymentMethodById>;

export async function deleteUserPaymentMethodById(id: string) {
  const { data } = await httpClient.request<ApiDeleteUserPaymentMethodByIdResponse>({
    method: "delete",
    url: `${BASE_PATH}/${id}`,
  });

  return data;
}