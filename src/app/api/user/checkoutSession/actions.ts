"use server";

import { ApiPostUserCheckoutSessionBody } from "./schemas";
import stripeClientNext from "@/utils/stripeClient/next";


function createAbsoluteUrl(url?: string) {
  if (!url) return undefined;
  return (url.startsWith("/") ? process.env.STRIPE_URL : "") + url;
}

export async function postUserCheckoutSession({ success_url, cancel_url, return_url, ...data }: ApiPostUserCheckoutSessionBody & { customer?: string, customer_email?: string }) {
  return await stripeClientNext.checkout.sessions.create({
    success_url: createAbsoluteUrl(success_url),
    cancel_url: createAbsoluteUrl(cancel_url),
    return_url: createAbsoluteUrl(return_url),
    currency: "cad",
    payment_method_types: ["card"],
    ...data,
  });
}