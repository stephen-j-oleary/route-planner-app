import { buffer } from "micro";

import { handleCustomerCreated, handleCustomerDeleted } from "./customers";
import nextConnect from "@/shared/nextConnect";
import mongooseMiddleware from "@/shared/nextConnect/middleware/mongoose";
import stripeClient from "@/shared/utils/stripeClient";

const webhookSecret = process.env.PAY_WEBHOOK_SECRET;


export const config = { api: { bodyParser: false } };

const handler = nextConnect();

handler.use(mongooseMiddleware);

handler.post(async (req, res) => {
  const reqBuffer = await buffer(req);
  const signature = req.headers["stripe-signature"];

  let event;
  try {
    event = stripeClient.webhooks.constructEvent(reqBuffer, signature, webhookSecret);
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