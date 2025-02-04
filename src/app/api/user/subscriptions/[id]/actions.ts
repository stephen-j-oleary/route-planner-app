"use server";

import { revalidatePath } from "next/cache";
import { ApiError } from "next/dist/server/api-utils";
import { cookies } from "next/headers";

import { ApiPatchUserSubscriptionByIdBody } from "./schemas";
import pages from "@/pages";
import { auth } from "@/utils/auth";
import compareMongoIds from "@/utils/compareMongoIds";
import stripeClientNext from "@/utils/stripeClient/next";


export async function getUserSubscriptionById(id: string) {
  const { customerId } = await auth(cookies());

  const subscription = await stripeClientNext.subscriptions.retrieve(id);

  const subscriptionCustomerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
  if (!compareMongoIds(customerId, subscriptionCustomerId)) throw new ApiError(403, "User not authorized");

  return subscription;
}


export async function patchUserSubscriptionById(id: string, { cancel_at, ...body }: ApiPatchUserSubscriptionByIdBody) {
  const { customerId } = await auth(cookies());

  const subscription = await getUserSubscriptionById(id);
  if (!subscription) throw new ApiError(404, "Not found");

  const subscriptionCustomerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
  if (!compareMongoIds(customerId, subscriptionCustomerId)) throw new ApiError(403, "User not authorized");

  const res = await stripeClientNext.subscriptions.update(id, {
    cancel_at: cancel_at && cancel_at.valueOf() / 1000,
    ...body,
  });

  revalidatePath(pages.api.userSubscriptions);
  revalidatePath(pages.api.userPaymentMethods);

  return res;
}


export async function deleteUserSubscriptionById(id: string) {
  const { customerId } = await auth(cookies());

  const subscription = await getUserSubscriptionById(id);
  if (!subscription) throw new ApiError(404, "Not found");

  const subscriptionCustomerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
  if (!compareMongoIds(customerId, subscriptionCustomerId)) throw new ApiError(403, "User not authorized");

  await stripeClientNext.subscriptions.cancel(id);

  revalidatePath(pages.api.userSubscriptions);
  revalidatePath(pages.api.userPaymentMethods);
}