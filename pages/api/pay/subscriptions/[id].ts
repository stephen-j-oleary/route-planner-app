import { isString } from "lodash";
import Stripe from "stripe";

import nextConnect from "@/shared/nextConnect";
import isCustomerAuthenticated from "@/shared/nextConnect/middleware/isCustomerAuthenticated";
import isUserAuthenticated from "@/shared/nextConnect/middleware/isUserAuthenticated";
import parseQuery from "@/shared/nextConnect/middleware/parseQuery";
import { ForbiddenError, NotFoundError, RequestError } from "@/shared/utils/ApiErrors";
import { getAuthUser } from "@/shared/utils/auth/serverHelpers";
import compareMongoIds from "@/shared/utils/compareMongoIds";
import { stripeApiClient } from "@/shared/utils/stripeClient";


const handler = nextConnect();

export interface ApiGetSubscriptionQuery extends Stripe.SubscriptionRetrieveParams {
  id: string;
}
export type ApiGetSubscriptionResponse = Awaited<ReturnType<typeof handleGetSubscription>>;

export async function handleGetSubscription(id: ApiGetSubscriptionQuery["id"], query?: Omit<ApiGetSubscriptionQuery, "id">) {
  return await stripeApiClient.subscriptions.retrieve(id, query);
}

handler.get(
  parseQuery,
  isUserAuthenticated,
  isCustomerAuthenticated,
  async (req, res) => {
    const { id, ...query } = req.query;

    if (!isString(id)) throw new RequestError();

    const subscription = await handleGetSubscription(id, query);
    if (!subscription) throw new NotFoundError();

    const authUser = await getAuthUser(req, res);
    if (!compareMongoIds(authUser.customerId, subscription.customer)) throw new ForbiddenError();

    res.status(200).json(subscription);
  }
);

export interface ApiPatchSubscriptionQuery {
  id: string;
}
export interface ApiPatchSubscriptionBody extends Stripe.SubscriptionUpdateParams {}
export type ApiPatchSubscriptionResponse = Awaited<ReturnType<typeof handlePatchSubscription>>;

export async function handlePatchSubscription(id: ApiPatchSubscriptionQuery["id"], body: ApiPatchSubscriptionBody) {
  return await stripeApiClient.subscriptions.update(id, body);
}

handler.patch(
  isUserAuthenticated,
  isCustomerAuthenticated,
  async (req, res) => {
    const { query: { id }, body } = req;

    if (!isString(id)) throw new RequestError("Invalid id");

    const subscription = await handleGetSubscription(id);
    if (!subscription) throw new NotFoundError();

    const authUser = await getAuthUser(req, res);
    if (!compareMongoIds(authUser.customerId, subscription.customer)) throw new ForbiddenError();

    const newSubscription = await handlePatchSubscription(id, body);
    res.status(200).json(newSubscription);
  }
);

export interface ApiDeleteSubscriptionQuery extends Stripe.SubscriptionDeleteParams {
  id: string;
}
export type ApiDeleteSubscriptionResponse = Awaited<ReturnType<typeof handleDeleteSubscription>>;

export async function handleDeleteSubscription(id: string, query: Omit<ApiDeleteSubscriptionQuery, "id">) {
  return await stripeApiClient.subscriptions.cancel(id, query);
}

handler.delete(
  isUserAuthenticated,
  isCustomerAuthenticated,
  async (req, res) => {
    const { id, ...query } = req.query;

    if (!isString(id)) throw new RequestError();

    const subscription = await handleGetSubscription(id, query);
    if (!subscription) throw new NotFoundError();

    const authUser = await getAuthUser(req, res);
    if (!compareMongoIds(authUser.customerId, subscription.customer)) throw new ForbiddenError();

    await handleDeleteSubscription(id, query);
    res.status(204).end();
  }
);

export default handler;