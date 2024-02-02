import { buffer } from "micro";
import Stripe from "stripe";

import User from "@/models/User";
import nextConnect from "@/nextConnect";
import { RequestError } from "@/utils/ApiErrors";
import stripeClientNext from "@/utils/stripeClient/next";

const WEBHOOK_SECRET = process.env.STRIPE_PAYWEBHOOK_SECRET;
if (!WEBHOOK_SECRET) throw new Error("Missing Stripe webhook secret");


const handler = nextConnect();


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

handler.post(
  async (req, res) => {
    const reqBuffer = await buffer(req);
    const signature = req.headers["stripe-signature"];
    if (!signature) throw new RequestError("Missing stripe-signature header");

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

      res.status(204).end();
    }
    catch (error) {
      throw { status: 400, message: "Webhook Error", error };
    }
  }
);


export default handler;