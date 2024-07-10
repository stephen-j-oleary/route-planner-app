"use server";

import { ApiGetUserSubscriptionsQuery } from "./schemas";
import stripeClientNext from "@/utils/stripeClient/next";


export async function getUserSubscriptions({ customer, ...query }: ApiGetUserSubscriptionsQuery & { customer?: string }) {
  if (!customer) return [];
  const { data } = await stripeClientNext.subscriptions.list({ customer, ...query });
  return data;
}