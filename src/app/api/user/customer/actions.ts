import { ApiError } from "next/dist/server/api-utils";

import stripeClientNext from "@/utils/stripeClient/next";


export async function getUserCustomer(id: string) {
  const customer = await stripeClientNext.customers.retrieve(id);
  if (!customer) throw new ApiError(404, "Not found");

  return customer;
}


export async function deleteUserCustomer(id: string) {
  const { deleted } = await stripeClientNext.customers.del(id);
  if (!deleted) throw new ApiError(404, "Not found");

  return;
}