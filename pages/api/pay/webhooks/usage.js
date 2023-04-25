import { v4 as uuid } from "uuid";

import nextConnect from "@/shared/nextConnect";
import stripeClient from "@/shared/utils/stripeClient";

const webhookSecret = process.env.PAY_WEBHOOK_SECRET;


const handler = nextConnect();

handler.post(async (req, res) => {
  const signature = req.headers["webhook-signature"];
  const { subscriptionItem, quantity, action = "increment" } = req.body;

  if (signature !== webhookSecret) throw { status: 401, message: "Not authorized" };

  const timestamp = parseInt(Date.now() / 1000);
  const idempotencyKey = uuid();

  await stripeClient.subscriptionItems.createUsageRecord(
    subscriptionItem,
    { quantity, timestamp, action },
    { idempotencyKey }
  );

  res.status(204).end();
});

export default handler;