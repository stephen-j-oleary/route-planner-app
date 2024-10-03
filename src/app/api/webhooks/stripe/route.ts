import { NextResponse } from "next/server";
import Stripe from "stripe";

import User from "@/models/User";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import stripeClientNext from "@/utils/stripeClient/next";

const WEBHOOK_SECRET = process.env.STRIPE_PAYWEBHOOK_SECRET;
if (!WEBHOOK_SECRET) throw new Error("Missing Stripe webhook secret");


export async function handleCustomerCreated(event: Stripe.CustomerCreatedEvent) {
  const customer = event.data.object;

  await User.findOneAndUpdate(
    { email: customer.email },
    { $set: { customerId: customer.id } }
  ).exec();
}

export async function handleCustomerDeleted(event: Stripe.CustomerDeletedEvent) {
  const customer = event.data.object;

  await User.findOneAndUpdate(
    { email: customer.email },
    { $unset: { customerId: "" } }
  ).exec();
}

export const POST: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const reqBuffer = await req.text();
    const signature = req.headers.get("stripe-signature");
    if (!signature) throw new ApiError(400, "Missing stripe-signature header");

    try {
      const event = stripeClientNext.webhooks.constructEvent(reqBuffer, signature, WEBHOOK_SECRET);

      switch (event.type) {
        case "customer.created":
          await handleCustomerCreated(event);
          break;
        case "customer.deleted":
          await handleCustomerDeleted(event);
          break;
      }

      return new NextResponse(null, { status: 204 });
    }
    catch (err) {
      console.error(err)
      throw new ApiError(400, "Webhook Error");
    }
  }
);