import { buffer } from "micro";

import { handleCustomerCreated, handleCustomerDeleted } from "./customers";
import nextConnect from "@/nextConnect";
import mongooseMiddleware from "@/nextConnect/middleware/mongoose";
import { stripeApiClient } from "@/utils/stripeClient";

const WEBHOOK_SECRET = process.env.STRIPE_PAYWEBHOOK_SECRET;


export const config = { api: { bodyParser: false } };

const handler = nextConnect();

handler.use(mongooseMiddleware);

handler.post(async (req, res) => {
  const reqBuffer = await buffer(req);
  const signature = req.headers["stripe-signature"];

  let event;
  try {
    event = stripeApiClient.webhooks.constructEvent(reqBuffer, signature, WEBHOOK_SECRET);
  }
  catch (error) {
    throw { status: 400, message: "Webhook Error", error };
  }

  switch (event.type) {
    case "customer.created":
      await handleCustomerCreated(event);
      break;
    case "customer.deleted":
      await handleCustomerDeleted(event);
      break;
  }

  res.status(200).end();
});

export default handler;