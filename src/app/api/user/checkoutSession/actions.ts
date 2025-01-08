"use server";

import { ApiPostUserCheckoutSessionBody } from "./schemas";
import { toAbsolute } from "@/utils/absolute";
import stripeClientNext from "@/utils/stripeClient/next";


export async function postUserCheckoutSession({ success_url, cancel_url, return_url, ...data }: ApiPostUserCheckoutSessionBody & { customer?: string, customer_email?: string }) {
  return await stripeClientNext.checkout.sessions.create({
    success_url: success_url ? (await toAbsolute(success_url)) : undefined,
    cancel_url: cancel_url ? (await toAbsolute(cancel_url)) : undefined,
    return_url: return_url ? (await toAbsolute(return_url)) : undefined,
    currency: "cad",
    payment_method_types: ["card"],
    ...data,
  });
}