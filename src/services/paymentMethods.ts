import "client-only";

import { revalidatePath } from "next/cache";

import { ApiDeleteUserPaymentMethodByIdResponse, ApiGetUserPaymentMethodByIdQuery, ApiGetUserPaymentMethodByIdResponse } from "@/app/api/user/paymentMethods/[id]/route";
import { ApiGetUserPaymentMethodsQuery, ApiGetUserPaymentMethodsResponse } from "@/app/api/user/paymentMethods/route";
import fetchJson from "@/utils/fetchJson";
import pages from "pages";


export async function getUserPaymentMethods(params: ApiGetUserPaymentMethodsQuery = {}) {
  return await fetchJson<ApiGetUserPaymentMethodsResponse>(
    pages.api.userPaymentMethods,
    {
      method: "GET",
      query: params,
    },
  );
}


export async function getUserPaymentMethodById(id: string, params: ApiGetUserPaymentMethodByIdQuery = {}) {
  return await fetchJson<ApiGetUserPaymentMethodByIdResponse>(
    `${pages.api.userPaymentMethods}/${id}`,
    {
      method: "GET",
      query: params,
    },
  );
}


export async function deleteUserPaymentMethodById(id: string) {
  const data = await fetchJson<ApiDeleteUserPaymentMethodByIdResponse>(
    `${pages.api.userPaymentMethods}/${id}`,
    { method: "DELETE" },
  );

  revalidatePath(pages.api.userPaymentMethods);

  return data;
}