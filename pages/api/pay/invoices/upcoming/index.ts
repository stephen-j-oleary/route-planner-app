import Stripe from "stripe";

import nextConnect from "@/shared/nextConnect";
import isCustomerAuthenticated from "@/shared/nextConnect/middleware/isCustomerAuthenticated";
import isUserAuthenticated from "@/shared/nextConnect/middleware/isUserAuthenticated";
import parseExpand from "@/shared/nextConnect/middleware/parseExpand";
import { ApiError, ForbiddenError, NotFoundError } from "@/shared/utils/ApiErrors";
import { getAuthUser } from "@/shared/utils/auth/serverHelpers";
import { stripeApiClient } from "@/shared/utils/stripeClient";


const handler = nextConnect();

handler.use(parseExpand);

export type ApiGetUpcomingInvoiceQuery = Stripe.InvoiceRetrieveUpcomingParams;
export type ApiGetUpcomingInvoiceResponse = Awaited<ReturnType<typeof handleGetUpcomingInvoice>>;

export async function handleGetUpcomingInvoice(query: ApiGetUpcomingInvoiceQuery) {
  return await stripeApiClient.invoices.retrieveUpcoming(query);
}

handler.get(
  isUserAuthenticated,
  isCustomerAuthenticated,
  async (req, res) => {
    const { query } = req;

    const authUser = await getAuthUser(req, res);
    if (query.customer && authUser.customerId !== query.customer) throw new ForbiddenError();

    const data = await handleGetUpcomingInvoice({ ...query, customer: authUser.customerId });
    if (!data) throw new NotFoundError();

    res.status(200).json(data);
  }
);

export type ApiPostUpcomingInvoiceBody = Stripe.InvoiceRetrieveUpcomingParams;
export type ApiPostUpcomingInvoiceResponse = Awaited<ReturnType<typeof handleCreateUpcomingInvoice>>;

export async function handleCreateUpcomingInvoice(params: ApiPostUpcomingInvoiceBody) {
  return await stripeApiClient.invoices.retrieveUpcoming(params);
}

handler.post(
  isUserAuthenticated,
  isCustomerAuthenticated,
  async (req, res) => {
    const { body } = req;

    const authUser = await getAuthUser(req, res);
    if (body.customer && authUser.customerId !== body.customer) throw new ForbiddenError();

    const data = await handleCreateUpcomingInvoice({ ...body, customer: authUser.customerId });
    if (!data) throw new ApiError({ status: 500, message: "Resource not created" });

    res.status(201).json(data);
  }
);

export default handler;