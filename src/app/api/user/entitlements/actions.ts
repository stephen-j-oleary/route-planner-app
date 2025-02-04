import { ApiError } from "next/dist/server/api-utils";

import { getUserCustomer } from "../customer/actions";
import pojo from "@/utils/pojo";
import stripeClientNext from "@/utils/stripeClient/next";


export async function getUserActiveEntitlements() {
  const customer = await getUserCustomer();
  if (!customer) throw new ApiError(403, "User not authorized");

  const { data } = await stripeClientNext.entitlements.activeEntitlements.list({ customer: customer.id });
  return pojo(data);
}