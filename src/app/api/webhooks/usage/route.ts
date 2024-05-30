import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { InferType, number, object, string } from "yup";

import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import stripeClientNext from "@/utils/stripeClient/next";

const WEBHOOK_SECRET = process.env.STRIPE_PAYWEBHOOK_SECRET;
if (!WEBHOOK_SECRET) throw new Error("Missing Stripe webhook secret");


const ApiPostWebhookUsageBodySchema = object()
  .shape({
    subscriptionItem: string().required(),
    quantity: number().required(),
    action: string().oneOf(["increment", "set"]).required(),
  })
  .required()
  .noUnknown();
export type ApiPostWebhookUsageBody = InferType<typeof ApiPostWebhookUsageBodySchema>;

export async function handleChangeUsageRecord({ subscriptionItem, ...params }: ApiPostWebhookUsageBody) {
  const idempotencyKey = uuid();
  return await stripeClientNext.subscriptionItems.createUsageRecord(subscriptionItem, params, { idempotencyKey });
}

export const POST: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const body = await ApiPostWebhookUsageBodySchema
      .validate(await req.json())
      .catch(err => {
        throw new ApiError(400, err.message);
      });

      const signature = req.headers.get("webhook-signature");
      if (!signature) throw new ApiError(400, "Missing webhook-signature header");

      if (signature !== WEBHOOK_SECRET) throw new ApiError(403, "Forbidden");

      await handleChangeUsageRecord(body);

      return new NextResponse(null, { status: 204 });
  }
);