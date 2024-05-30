import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { array, InferType, object, string } from "yup";

import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import { auth } from "@/utils/auth";
import stripeClientNext from "@/utils/stripeClient/next";


function createAbsoluteUrl(url?: string) {
  if (!url) return undefined;
  return (url.startsWith("/") ? process.env.STRIPE_URL : "") + url;
}


const ApiPostUserCheckoutSessionBodySchema = object()
  .shape({
    cancel_url: string().when("ui_mode", {
      is: "hosted",
      then: schema => schema.required(),
    }),
    success_url: string().when("ui_mode", {
      is: "hosted",
      then: schema => schema.required(),
    }),
    return_url: string().when("ui_mode", {
      is: "enbedded",
      then: schema => schema.required(),
    }),
    expand: array(string().required()).optional(),
    line_items: array().optional(),
    mode: string().oneOf(["payment", "setup", "subscription"]).optional(),
    ui_mode: string().oneOf(["embedded", "hosted"]).optional(),
  })
  .required()
  .noUnknown();
export type ApiPostUserCheckoutSessionBody = InferType<typeof ApiPostUserCheckoutSessionBodySchema>;
export type ApiPostUserCheckoutSessionResponse = Awaited<ReturnType<typeof handlePostUserCheckoutSession>>;

export async function handlePostUserCheckoutSession({ success_url, cancel_url, return_url, ...data }: ApiPostUserCheckoutSessionBody & { customer?: string, customer_email?: string }) {
  return await stripeClientNext.checkout.sessions.create({
    success_url: createAbsoluteUrl(success_url),
    cancel_url: createAbsoluteUrl(cancel_url),
    return_url: createAbsoluteUrl(return_url),
    currency: "cad",
    payment_method_types: ["card"],
    ...data,
  });
}

export const POST: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const { userId, email, customerId } = await auth(cookies());
    if (!userId) throw new ApiError(401, "User required");

    const body = await ApiPostUserCheckoutSessionBodySchema
      .validate(await req.json())
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    const session = await handlePostUserCheckoutSession({
      ...body,
      customer: customerId || undefined,
      customer_email: !customerId && email || undefined,
    });

    return NextResponse.json(session);
  }
);