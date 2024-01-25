import Stripe from "stripe";

import nextConnect from "@/nextConnect";
import authorization from "@/nextConnect/middleware/authorization";
import { ForbiddenError } from "@/utils/ApiErrors";
import { getAuthUser } from "@/utils/auth/serverHelpers";
import { stripeApiClient } from "@/utils/stripeClient";


const handler = nextConnect();

export type ApiGetInvoicesQuery = Stripe.InvoiceListParams;
export type ApiGetInvoicesResponse = Awaited<ReturnType<typeof handleGetInvoices>>;

export async function handleGetInvoices(query: ApiGetInvoicesQuery) {
  const { data } = await stripeApiClient.invoices.list(query);
  return data;
}

handler.get(
  authorization({ isSubscriber: true }),
  async (req, res) => {
    const { query } = req;

    const authUser = await getAuthUser(req, res);
    if (query.customer && authUser.customerId !== query.customer) throw new ForbiddenError();

    const data = await handleGetInvoices({ ...query, customer: authUser.customerId });

    res.status(200).json(data);
  }
);

export default handler;