import { v4 as uuid } from "uuid";
import { InferType, number, object, string } from "yup";

import nextConnect from "@/nextConnect";
import validation, { ValidatedType } from "@/nextConnect/middleware/validation";
import { AuthError, RequestError } from "@/utils/ApiErrors";
import stripeClientNext from "@/utils/stripeClient/next";

const WEBHOOK_SECRET = process.env.STRIPE_PAYWEBHOOK_SECRET;
if (!WEBHOOK_SECRET) throw new Error("Missing Stripe webhook secret");


const handler = nextConnect();


const ApiPostWebhookUsageSchema = object({
  body: object({
    subscriptionItem: string().required(),
    quantity: number().required(),
    action: string().oneOf(["increment", "set"]).required(),
  }),
});
export type ApiPostWebhookUsageBody = Omit<InferType<typeof ApiPostWebhookUsageSchema>["body"], "subscriptionItem">;

export async function handleChangeUsageRecord(subscriptionItem: string, params: ApiPostWebhookUsageBody) {
  const idempotencyKey = uuid();
  return await stripeClientNext.subscriptionItems.createUsageRecord(subscriptionItem, params, { idempotencyKey });
}

handler.post(
  validation(ApiPostWebhookUsageSchema),
  async (req, res) => {
    const { body: { subscriptionItem, ...body } } = req.locals.validated as ValidatedType<typeof ApiPostWebhookUsageSchema>;
    const signature = req.headers["webhook-signature"];
    if (!signature) throw new RequestError("Missing stripe-signature header");

    if (signature !== WEBHOOK_SECRET) throw new AuthError();

    await handleChangeUsageRecord(subscriptionItem, body);

    res.status(204).end();
  }
);


export default handler;