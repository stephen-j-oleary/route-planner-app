import "client-only";

import { revalidatePath } from "next/cache";

import { ApiDeleteUserSubscriptionByIdResponse, ApiPatchUserSubscriptionByIdBody, ApiPatchUserSubscriptionByIdResponse } from "@/app/api/user/subscriptions/[id]/route";
import fetchJson from "@/utils/fetchJson";
import pages from "pages";


export async function updateUserSubscriptionById(id: string, changes: ApiPatchUserSubscriptionByIdBody) {
  const data = await fetchJson<ApiPatchUserSubscriptionByIdResponse>(
    `${pages.api.userSubscriptions}/${id}`,
    {
      method: "PATCH",
      data: changes,
    },
  );

  revalidatePath(pages.api.userSubscriptions);
  revalidatePath(pages.api.userPaymentMethods);

  return data;
}


export async function cancelUserSubscriptionById(id: string) {
  const data = await fetchJson<ApiDeleteUserSubscriptionByIdResponse>(
    `${pages.api.userSubscriptions}/${id}`,
    { method: "DELETE" },
  );

  revalidatePath(pages.api.userSubscriptions);
  revalidatePath(pages.api.userPaymentMethods);

  return data;
}