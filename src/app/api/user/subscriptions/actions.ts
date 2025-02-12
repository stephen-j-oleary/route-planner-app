"use server";

import { ApiError } from "next/dist/server/api-utils";

import { ApiGetUserSubscriptionsQuery, ApiPostUserSubscriptionBody } from "./schemas";
import { getUserCustomer, postUserCustomer } from "@/app/api/user/customer/actions";
import pages from "@/pages";
import auth from "@/utils/auth";
import { handleSignIn } from "@/utils/auth/actions";
import pojo from "@/utils/pojo";
import stripeClientNext from "@/utils/stripeClient/next";


export async function getUserSubscriptions(query: ApiGetUserSubscriptionsQuery = {}) {
  await auth(pages.api.userSubscriptions).api();

  const { id: customerId } = await getUserCustomer();

  const { data: subscriptions } = await stripeClientNext.subscriptions.list({ customer: customerId, ...query });

  return pojo(subscriptions);
}

export async function postUserSubscription({ price }: ApiPostUserSubscriptionBody) {
  await auth(pages.api.userSubscriptions).api();

  const { id: customerId } =
    await getUserCustomer().catch(() => null)
    ?? await postUserCustomer();

  const subscriptions = await getUserSubscriptions();
  if (subscriptions.length) throw new ApiError(409, "Already subscribed");

  const subscription = await stripeClientNext.subscriptions.create({
    customer: customerId,
    items: [{ price }],
  });

  await handleSignIn();

  return subscription;
}