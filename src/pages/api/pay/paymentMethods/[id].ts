import { isArray } from "lodash";
import Stripe from "stripe";

import nextConnect from "@/nextConnect";
import isUserAuthenticated from "@/nextConnect/middleware/isUserAuthenticated";
import parseExpand from "@/nextConnect/middleware/parseExpand";
import { NotFoundError } from "@/utils/ApiErrors";
import { stripeApiClient } from "@/utils/stripeClient";


const handler = nextConnect();

export type ApiGetPaymentMethodByIdQuery = Stripe.PaymentMethodRetrieveParams;
export type ApiGetPaymentMethodByIdResponse = Awaited<ReturnType<typeof handleGetPaymentMethodById>>;
export async function handleGetPaymentMethodById(id: string, query: ApiGetPaymentMethodByIdQuery) {
  return await stripeApiClient.paymentMethods.retrieve(id, query);
}

handler.get(
  parseExpand,
  isUserAuthenticated,
  async (req, res) => {
    const { id, ...query } = req.query;

    const data = await handleGetPaymentMethodById(id, query);
    if (!data) throw new NotFoundError();

    res.status(200).json(data);
  }
);

export type ApiDeletePaymentMethodByIdResponse = Awaited<ReturnType<typeof handleDeletePaymentMethodById>>;
export async function handleDeletePaymentMethodById(id: string) {
  return await stripeApiClient.paymentMethods.detach(id);
}

handler.delete(
  isUserAuthenticated,
  async (req, res) => {
    let { id } = req.query;
    if (isArray(id)) id = id[0];

    await handleDeletePaymentMethodById(id);

    res.status(204).end();
  }
);

export default handler;