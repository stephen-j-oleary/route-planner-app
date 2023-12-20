import { v4 as uuid } from "uuid";

import nextConnect from "@/shared/nextConnect";
import { stripeApiClient } from "@/shared/utils/stripeClient";

const WEBHOOK_SECRET = process.env.STRIPE_PAYWEBHOOK_SECRET;


const handler = nextConnect();

handler.post(async (req, res) => {
  const signature = req.headers["webhook-signature"];
  const { subscriptionItem, quantity, action = "increment" } = req.body;

  if (signature !== WEBHOOK_SECRET) throw { status: 401, message: "Not authorized" };

  const idempotencyKey = uuid();

  await stripeApiClient.subscriptionItems.createUsageRecord(
    subscriptionItem,
    { quantity, action },
    { idempotencyKey }
  );

  res.status(204).end();
});

export default handler;