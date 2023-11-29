import Stripe from "stripe";

import nextConnect from "@/shared/nextConnect";
import isCustomerAuthenticated from "@/shared/nextConnect/middleware/isCustomerAuthenticated";
import isUserAuthenticated from "@/shared/nextConnect/middleware/isUserAuthenticated";
import { ForbiddenError } from "@/shared/utils/ApiErrors";
import { getAuthUser } from "@/shared/utils/auth/serverHelpers";
import { stripeApiClient } from "@/shared/utils/stripeClient";


const handler = nextConnect();

export type ApiGetInvoicesQuery = Stripe.InvoiceListParams;
export type ApiGetInvoicesResponse = Awaited<ReturnType<typeof handleGetInvoices>>;

export async function handleGetInvoices(query: ApiGetInvoicesQuery) {
  const { data } = await stripeApiClient.invoices.list(query);
  return data;
}

handler.get(
  isUserAuthenticated,
  isCustomerAuthenticated,
  async (req, res) => {
    const { query } = req;

    const authUser = await getAuthUser(req, res);
    if (query.customer && authUser.customerId !== query.customer) throw new ForbiddenError();

    const data = await handleGetInvoices({ ...query, customer: authUser.customerId });

    res.status(200).json(data);
  }
);

export default handler;