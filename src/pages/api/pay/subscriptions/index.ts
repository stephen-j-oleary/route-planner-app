import { isNil, isString, isUndefined, omitBy } from "lodash";
import Stripe from "stripe";

import nextConnect from "@/nextConnect";
import authMiddleware from "@/nextConnect/middleware/auth";
import parseQuery from "@/nextConnect/middleware/parseQuery";
import { handleCreateCustomer } from "@/pages/api/pay/customers";
import { ConflictError, ForbiddenError, RequestError } from "@/utils/ApiErrors";
import { getAuthUser } from "@/utils/auth/serverHelpers";
import { isValidSubscriptionStatus } from "@/utils/stripe";
import { stripeApiClient } from "@/utils/stripeClient";


const handler = nextConnect();

export type ApiGetSubscriptionsQuery = Omit<Stripe.SubscriptionListParams, "customer">;
export type ApiGetSubscriptionsResponse = Awaited<ReturnType<typeof handleGetSubscriptions>>;

export async function handleGetSubscriptions(query?: Stripe.SubscriptionListParams) {
  const { data } = await stripeApiClient.subscriptions.list(query);
  return data || [];
}

handler.get(
  parseQuery,
  authMiddleware({ requireAccount: true, requireSubscription: true }),
  async (req, res) => {
    const { customer,  price, status } = req.query;
    if (!isUndefined(customer) && !isString(customer)) throw new RequestError("Invalid param: 'customer'");
    if (!isUndefined(price) && !isString(price)) throw new RequestError("Invalid param: 'price'");
    if (!isUndefined(status) && !isValidSubscriptionStatus(status)) throw new RequestError("Invalid param: 'status'");
    const query = omitBy({ customer, price, status }, isNil);

    const authUser = await getAuthUser(req, res);
    if (customer && customer !== authUser.customerId) throw new ForbiddenError();

    const data = await handleGetSubscriptions({
      ...query,
      customer: authUser.customerId, /* Filter by authorized customer id */
    });

    res.status(200).json(data);
  }
);

export type ApiPostSubscriptionsBody = Omit<Stripe.SubscriptionCreateParams, "customer">;
export type ApiPostSubscriptionsResponse = Awaited<ReturnType<typeof handleCreateSubscription>>;

export async function handleCreateSubscription(data: Stripe.SubscriptionCreateParams) {
  return await stripeApiClient.subscriptions.create(data);
}

handler.post(
  authMiddleware({ requireAccount: true, requireSubscription: false }),
  async (req, res) => {
    const authUser = await getAuthUser(req, res);

    // Check for or create customer
    const { email } = authUser;
    let { customerId } = authUser;
    customerId ||= (await handleCreateCustomer({ email })).id;

    const existingSubscriptions = await handleGetSubscriptions({ customer: customerId });
    if (existingSubscriptions.length > 0) throw new ConflictError("Already subscribed");

    const subscription = await handleCreateSubscription({
      ...req.body,
      customer: customerId,
    });

    res.status(201).json(subscription);
  }
);

export default handler;