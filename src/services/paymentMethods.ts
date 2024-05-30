"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { ApiDeleteUserPaymentMethodByIdResponse, ApiGetUserPaymentMethodByIdQuery, ApiGetUserPaymentMethodByIdResponse } from "@/app/api/user/paymentMethods/[id]/route";
import { ApiGetUserPaymentMethodsQuery, ApiGetUserPaymentMethodsResponse } from "@/app/api/user/paymentMethods/route";
import fetchJson from "@/utils/fetchJson";
import pages from "pages";


export async function getUserPaymentMethods(params: ApiGetUserPaymentMethodsQuery = {}) {
  const res = await fetchJson(
    pages.api.userPaymentMethods,
    {
      method: "GET",
      query: params,
      headers: { Cookie: cookies().toString() },
    },
  );
  const data = await res.json();

  if (!res.ok) {
    if (res.status === 401) return [];
    throw data;
  }

  return data as ApiGetUserPaymentMethodsResponse;
}


export async function getUserPaymentMethodById(id: string, params: ApiGetUserPaymentMethodByIdQuery = {}) {
  const res = await fetchJson(
    `${pages.api.userPaymentMethods}/${id}`,
    {
      method: "GET",
      query: params,
      headers: { Cookie: cookies().toString() },
    },
  );
  const data = await res.json();

  if (!res.ok) throw data;

  return data as ApiGetUserPaymentMethodByIdResponse;
}


export async function deleteUserPaymentMethodById(id: string) {
  const res = await fetchJson(
    `${pages.api.userPaymentMethods}/${id}`,
    {
      method: "DELETE",
      headers: { Cookie: cookies().toString() },
    },
  );
  const data = await res.json();

  if (!res.ok) throw data;

  revalidatePath(pages.api.userPaymentMethods);

  return data as ApiDeleteUserPaymentMethodByIdResponse;
}