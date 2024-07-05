"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { ApiPostUserCheckoutSessionBody, ApiPostUserCheckoutSessionResponse } from "@/app/api/user/checkoutSession/route";
import fetchJson from "@/utils/fetchJson";
import pages from "pages";


export async function createUserCheckoutSession(sessionData: ApiPostUserCheckoutSessionBody) {
  const data = await fetchJson<ApiPostUserCheckoutSessionResponse>(
    pages.api.userCheckoutSession,
    {
      method: "POST",
      data: sessionData,
      headers: { Cookie: cookies().toString() },
    },
  );

  revalidatePath(pages.api.userSubscriptions);

  return data;
}