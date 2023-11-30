import Stripe from "stripe";

import nextConnect from "@/shared/nextConnect";
import isUserAuthenticated from "@/shared/nextConnect/middleware/isUserAuthenticated";
import parseExpand from "@/shared/nextConnect/middleware/parseExpand";
import { NotFoundError } from "@/shared/utils/ApiErrors";
import { getAuthUser } from "@/shared/utils/auth/serverHelpers";
import { stripeApiClient } from "@/shared/utils/stripeClient";


const handler = nextConnect();

handler.get(
  parseExpand,
  isUserAuthenticated,
  async (req, res) => {
    const { query } = req;

    const { data } = await stripeApiClient.checkout.sessions.list(query);
    if (!data) throw new NotFoundError();

    res.status(200).json(data);
  }
);

export type ApiPostCheckoutSessionBody = Omit<Stripe.Checkout.SessionCreateParams, "customer" | "customer_email">;
export type APiPostCheckoutSessionResponse = Stripe.Checkout.Session;

handler.post(
  isUserAuthenticated,
  async (req, res) => {
    const {
      success_url,
      cancel_url,
      return_url,
      ...body
    } = req.body;

    const authUser = await getAuthUser(req, res);

    const session = await stripeApiClient.checkout.sessions.create({
      customer: authUser.customerId || undefined,
      customer_email: (!authUser.customerId && authUser.email) || undefined,
      success_url: createAbsoluteUrl(success_url),
      cancel_url: createAbsoluteUrl(cancel_url),
      return_url: createAbsoluteUrl(return_url),
      ...body,
    });

    res.status(201).json(session);
  }
);

export default handler;


function createAbsoluteUrl(url?: string) {
  if (!url) return undefined;
  return (url.startsWith("/") ? process.env.STRIPE_URL : "") + url;
}