"use server";

import { ApiError } from "next/dist/server/api-utils";

import pages from "@/pages";
import auth from "@/utils/auth";
import { handleSignIn } from "@/utils/auth/actions";
import pojo from "@/utils/pojo";
import stripeClientNext from "@/utils/stripeClient/next";


export async function getUserCustomer() {
  const { customer: { id: customerId } = {}, user: { email } = {} } = await auth(pages.api.userCustomer).api();

  const customer = customerId
    ? await stripeClientNext.customers.retrieve(customerId, { expand: ["subscriptions.data"] })
    : (await stripeClientNext.customers.list({ email, expand: ["data.subscriptions.data"] })).data[0];
  if (!customer || customer.deleted) throw new ApiError(404, "Not found");

  return pojo(customer);
}


export async function postUserCustomer() {
  const { user: { email } = {} } = await auth(pages.api.userCustomer).api();
  const existingCustomer = await getUserCustomer().catch(() => null);
  if (existingCustomer) throw new ApiError(409, "Customer already exists");

  const newCustomer = await stripeClientNext.customers.create({ email });
  if (!newCustomer) throw new ApiError(500, "Failed to create customer");

  await handleSignIn();

  return pojo(newCustomer);
}


export async function deleteUserCustomer(id: string) {
  await auth(pages.api.userCustomer).api();

  const { deleted } = await stripeClientNext.customers.del(id);
  if (!deleted) throw new ApiError(404, "Not found");

  return;
}