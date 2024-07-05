import "client-only";

import { revalidatePath } from "next/cache";

import { ApiPostUserCheckoutSessionBody, ApiPostUserCheckoutSessionResponse } from "@/app/api/user/checkoutSession/route";
import fetchJson from "@/utils/fetchJson";
import pages from "pages";


export async function createUserCheckoutSession(sessionData: ApiPostUserCheckoutSessionBody) {
  const data = await fetchJson<ApiPostUserCheckoutSessionResponse>(
    pages.api.userCheckoutSession,
    {
      method: "POST",
      data: sessionData,
    },
  );

  revalidatePath(pages.api.userSubscriptions);

  return data;
}