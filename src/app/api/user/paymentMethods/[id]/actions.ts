"use server";

import { revalidatePath } from "next/cache";
import { ApiError } from "next/dist/server/api-utils";
import { cookies } from "next/headers";

import { ApiGetUserPaymentMethodByIdQuery } from "./schemas";
import pages from "@/pages";
import auth from "@/utils/auth";
import stripeClientNext from "@/utils/stripeClient/next";


export async function getUserPaymentMethodById(id: string, query: ApiGetUserPaymentMethodByIdQuery = {}) {
  const { customer: { id: customerId } = {} } = await auth(cookies()).api();

  const paymentMethod = await stripeClientNext.paymentMethods.retrieve(id, query);
  if (!paymentMethod) throw new ApiError(404, "Not found");

  if (paymentMethod.customer !== customerId) throw new ApiError(403, "Forbidden");

  return paymentMethod;
}


export async function deleteUserPaymentMethodById(id: string) {
  const { customer: { id: customerId } = {} } = await auth(cookies()).api();

  const paymentMethod = await getUserPaymentMethodById(id);
  if (!paymentMethod) throw new ApiError(404, "Not found");

  if (paymentMethod.customer !== customerId) throw new ApiError(403, "Forbidden");

  const deletedPaymentMethod = await stripeClientNext.paymentMethods.detach(id);
  if (!deletedPaymentMethod) throw new ApiError(404, "Not found");

  revalidatePath(pages.api.userPaymentMethods);

  return deletedPaymentMethod;
}