"use server";

import pojo from "@/utils/pojo";
import stripeClientNext from "@/utils/stripeClient/next";
import { toAbsolute } from "@/utils/url";


export async function postUserBillingPortal({ return_url, ...data }: { customer: string, return_url?: string }) {
  return pojo(
    await stripeClientNext.billingPortal.sessions.create({
      return_url: return_url ? toAbsolute(return_url) : undefined,
      ...data,
    })
  );
}