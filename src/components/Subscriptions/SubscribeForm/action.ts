"use server";

import { redirect } from "next/navigation";

import { postUserSubscription } from "@/app/api/user/subscriptions/actions";
import { getCallbackUrl } from "@/utils/auth/utils";


export default async function subscribe({
  priceId,
  searchParams,
}: {
  priceId: string,
  searchParams: URLSearchParams,
}) {
  const callbackUrl = await getCallbackUrl(Object.fromEntries(searchParams.entries()));

  await postUserSubscription({ price: priceId });

  redirect(callbackUrl);
}