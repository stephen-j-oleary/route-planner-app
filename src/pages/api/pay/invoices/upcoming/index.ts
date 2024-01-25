import { isNil, isString, omitBy } from "lodash";
import Stripe from "stripe";

import nextConnect from "@/nextConnect";
import authorization from "@/nextConnect/middleware/authorization";
import parseExpand from "@/nextConnect/middleware/parseExpand";
import parseQuery from "@/nextConnect/middleware/parseQuery";
import { ApiError, ForbiddenError, NotFoundError, RequestError } from "@/utils/ApiErrors";
import { getAuthUser } from "@/utils/auth/serverHelpers";
import hasOneOf from "@/utils/hasOneOf";
import { stripeApiClient } from "@/utils/stripeClient";


const handler = nextConnect();

handler.use(parseExpand);

export type ApiGetUpcomingInvoiceQuery = Pick<Stripe.InvoiceRetrieveUpcomingParams, "customer" | "subscription">;
export type ApiGetUpcomingInvoiceResponse = Awaited<ReturnType<typeof handleGetUpcomingInvoice>>;

export async function handleGetUpcomingInvoice(query: ApiGetUpcomingInvoiceQuery) {
  return await stripeApiClient.invoices.retrieveUpcoming(query);
}

handler.get(
  authorization({ isSubscriber: true }),
  parseQuery,
  async (req, res) => {
    const { customer, subscription } = req.query;
    if (!isNil(customer) && !isString(customer)) throw new RequestError("Invalid param: 'customer'");
    if (!isNil(subscription) && !isString(subscription)) throw new RequestError("Invalid param: 'subscription'");
    const query = omitBy({ customer, subscription }, isNil);
    if (!hasOneOf(query, ["customer", "subscription"])) throw new RequestError("Missing required param: 'customer' or 'subscription'");

    const authUser = await getAuthUser(req, res);
    if (customer && authUser.customerId !== customer) throw new ForbiddenError();

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
  authorization({ isSubscriber: true }),
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