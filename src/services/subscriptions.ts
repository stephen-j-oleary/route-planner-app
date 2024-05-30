"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { ApiDeleteUserSubscriptionByIdResponse, ApiGetUserSubscriptionByIdResponse, ApiPatchUserSubscriptionByIdBody, ApiPatchUserSubscriptionByIdResponse } from "@/app/api/user/subscriptions/[id]/route";
import { ApiGetUserSubscriptionsQuery, ApiGetUserSubscriptionsResponse } from "@/app/api/user/subscriptions/route";
import fetchJson from "@/utils/fetchJson";
import pages from "pages";


export async function getUserSubscriptions(params: ApiGetUserSubscriptionsQuery = {}) {
  const res = await fetchJson(
    pages.api.userSubscriptions,
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

  return data as ApiGetUserSubscriptionsResponse;
}


export async function getUserSubscriptionById(id: string) {
  const res = await fetchJson(
    `${pages.api.userSubscriptions}/${id}`,
    {
      method: "GET",
      headers: { Cookie: cookies().toString() },
    },
  );
  const data = await res.json();

  if (!res.ok) throw data;

  return data as ApiGetUserSubscriptionByIdResponse;
}


export async function updateUserSubscriptionById(id: string, changes: ApiPatchUserSubscriptionByIdBody) {
  const res = await fetchJson(
    `${pages.api.userSubscriptions}/${id}`,
    {
      method: "PATCH",
      data: changes,
      headers: { Cookie: cookies().toString() },
    },
  );
  const data = await res.json();

  if (!res.ok) throw data;

  revalidatePath(pages.api.userSubscriptions);
  revalidatePath(pages.api.userPaymentMethods);

  return data as ApiPatchUserSubscriptionByIdResponse;
}


export async function cancelUserSubscriptionById(id: string) {
  const res = await fetchJson(
    `${pages.api.userSubscriptions}/${id}`,
    {
      method: "DELETE",
      headers: { Cookie: cookies().toString() },
    },
  );
  const data = await res.json();

  if (!res.ok) throw data;

  revalidatePath(pages.api.userSubscriptions);
  revalidatePath(pages.api.userPaymentMethods);

  return data as ApiDeleteUserSubscriptionByIdResponse;
}