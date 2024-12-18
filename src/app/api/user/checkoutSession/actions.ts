"use server";

import { ApiPostUserCheckoutSessionBody } from "./schemas";
import stripeClientNext from "@/utils/stripeClient/next";


function createAbsoluteUrl(url?: string) {
  if (!url) return undefined;
  if (!url.startsWith("/")) return url;

  const stripeUrl = process.env.STRIPE_URL;
  if (!stripeUrl) throw new Error("Invalid environment: Missing variable 'STRIPE_URL'");
  return stripeUrl + url;
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