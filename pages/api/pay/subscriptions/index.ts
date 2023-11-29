import { isString } from "lodash";
import Stripe from "stripe";

import { handleCreateCustomer } from "@/pages/api/pay/customers";
import nextConnect from "@/shared/nextConnect";
import isCustomerAuthenticated from "@/shared/nextConnect/middleware/isCustomerAuthenticated";
import isUserAuthenticated from "@/shared/nextConnect/middleware/isUserAuthenticated";
import parseQuery from "@/shared/nextConnect/middleware/parseQuery";
import { ConflictError, ForbiddenError, RequestError } from "@/shared/utils/ApiErrors";
import { getAuthUser } from "@/shared/utils/auth/serverHelpers";
import { isValidSubscriptionStatus } from "@/shared/utils/stripe";
import { stripeApiClient } from "@/shared/utils/stripeClient";


const handler = nextConnect();

export type ApiGetSubscriptionsQuery = Omit<Stripe.SubscriptionListParams, "customer">;
export type ApiGetSubscriptionsResponse = Awaited<ReturnType<typeof handleGetSubscriptions>>;

export async function handleGetSubscriptions(query?: Stripe.SubscriptionListParams) {
  const { data } = await stripeApiClient.subscriptions.list(query);
  return data || [];
}

handler.get(
  parseQuery,
  isUserAuthenticated,
  isCustomerAuthenticated,
  async (req, res) => {
    const { customer,  price, status } = req.query;
    if (!isString(customer)) throw new RequestError("Invalid customer");
    if (!isString(price)) throw new RequestError("Invalid price");
    if (!isValidSubscriptionStatus(status)) throw new RequestError("Invalid status");

    const authUser = await getAuthUser(req, res);
    if (customer && customer !== authUser.customerId) throw new ForbiddenError();

    const data = await handleGetSubscriptions({
      price,
      status,
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
  isUserAuthenticated,
  async (req, res) => {
    const authUser = await getAuthUser(req, res);

    // Check for or create customer
    let { customerId, email } = authUser;
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