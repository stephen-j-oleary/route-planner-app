"use server";

import { ApiError } from "next/dist/server/api-utils";

import { ApiGetUserPaymentMethodsQuery } from "./schemas";
import { getUserCustomer } from "../customer/actions";
import pojo from "@/utils/pojo";
import stripeClientNext from "@/utils/stripeClient/next";


export async function getUserPaymentMethods(query: ApiGetUserPaymentMethodsQuery = {}) {
  const customer = await getUserCustomer();
  if (!customer) throw new ApiError(403, "User not authorized");

  const { data } = await stripeClientNext.paymentMethods.list({ customer: customer.id, ...query });
  return pojo(data);
}