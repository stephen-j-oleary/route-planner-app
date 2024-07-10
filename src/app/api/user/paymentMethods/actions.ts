"use server";

import { ApiGetUserPaymentMethodsQuery } from "./schemas";
import stripeClientNext from "@/utils/stripeClient/next";


export async function getUserPaymentMethods({ customer, ...query }: ApiGetUserPaymentMethodsQuery & { customer?: string }) {
  if (!customer) return [];
  const { data } = await stripeClientNext.paymentMethods.list({ customer, ...query });
  return data;
}