"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { ApiPostUserCheckoutSessionBody, ApiPostUserCheckoutSessionResponse } from "@/app/api/user/checkoutSession/route";
import fetchJson from "@/utils/fetchJson";
import pages from "pages";


export async function createUserCheckoutSession(sessionData: ApiPostUserCheckoutSessionBody) {
  const res = await fetchJson(
    pages.api.userCheckoutSession,
    {
      method: "POST",
      data: sessionData,
      headers: { Cookie: cookies().toString() },
    },
  );
  const data = await res.json();

  if (!res.ok) throw data;

  revalidatePath(pages.api.userSubscriptions);

  return data as ApiPostUserCheckoutSessionResponse;
}