"use server";

import { ApiError } from "next/dist/server/api-utils";
import { cookies } from "next/headers";

import { ApiGetUserSubscriptionsQuery, ApiPostUserSubscriptionBody } from "./schemas";
import { auth } from "@/utils/auth";
import stripeClientNext from "@/utils/stripeClient/next";


export async function getUserSubscriptions({ customer, ...query }: ApiGetUserSubscriptionsQuery & { customer?: string }) {
  if (!customer) return [];
  const { data } = await stripeClientNext.subscriptions.list({ customer, ...query });
  return data;
}

export async function postUserSubscription({ price }: ApiPostUserSubscriptionBody) {
  const { customerId } = await auth(cookies());
  if (!customerId) throw new ApiError(403, "Customer not found");

  const subscriptions = await getUserSubscriptions({ customer: customerId });
  if (subscriptions.length) throw new ApiError(409, "Already subscribed");

  const subscription = await stripeClientNext.subscriptions.create({
    customer: customerId,
    items: [{ price }],
  });

  return subscription;
}