"use server";

import { ApiPostUserCheckoutSessionBody } from "./schemas";
import stripeClientNext from "@/utils/stripeClient/next";
import toAbsolute from "@/utils/toAbsolute";


export async function postUserCheckoutSession({ success_url, cancel_url, return_url, ...data }: ApiPostUserCheckoutSessionBody & { customer?: string, customer_email?: string }) {
  return await stripeClientNext.checkout.sessions.create({
    success_url: success_url ? toAbsolute(success_url) : undefined,
    cancel_url: cancel_url ? toAbsolute(cancel_url) : undefined,
    return_url: return_url ? toAbsolute(return_url) : undefined,
    currency: "cad",
    payment_method_types: ["card"],
    ...data,
  });
}