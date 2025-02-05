"use server";

import { ApiError } from "next/dist/server/api-utils";

import { getUserCustomer } from "../customer/actions";
import pojo from "@/utils/pojo";
import stripeClientNext from "@/utils/stripeClient/next";
import { toAbsolute } from "@/utils/url";


export async function postUserBillingPortal({ return_url, ...data }: { return_url?: string } = {}) {
  const { id: customerId } = await getUserCustomer();
  if (!customerId) throw new ApiError(403, "User not authorized");

  return pojo(
    await stripeClientNext.billingPortal.sessions.create({
      customer: customerId,
      return_url: return_url ? toAbsolute(return_url) : undefined,
      ...data,
    })
  );
}