import { isArray, isString } from "lodash";
import Stripe from "stripe";

import nextConnect from "@/nextConnect";
import authorization from "@/nextConnect/middleware/authorization";
import parseQuery from "@/nextConnect/middleware/parseQuery";
import { ConflictError, ForbiddenError, NotFoundError, RequestError } from "@/utils/ApiErrors";
import { getAuthUser } from "@/utils/auth/serverHelpers";
import compareMongoIds from "@/utils/compareMongoIds";
import { stripeApiClient } from "@/utils/stripeClient";


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
  authorization({ isUser: true }),
  async (req, res) => {
    const { id, ...query } = req.query;
    const _id = isArray(id) ? id[0] : id;

    const subscription = await handleGetSubscription(_id, query);
    if (!subscription) throw new NotFoundError();

    const authUser = await getAuthUser(req, res);
    if (!compareMongoIds(authUser?.customerId, subscription.customer)) throw new ForbiddenError();

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
  authorization({ isSubscriber: true }),
  async (req, res) => {
    let { id } = req.query;
    if (isArray(id)) id = id[0];

    const { items, ...body } = req.body;
    if (items && !isArray(items)) throw new RequestError("Invalid param: 'items'");

    const subscription = await handleGetSubscription(id);
    if (!subscription) throw new NotFoundError();

    const authUser = await getAuthUser(req, res);
    if (!compareMongoIds(authUser.customerId, subscription.customer)) throw new ForbiddenError();

    if (subscription.items.data.some(oldItem => items && items.some((newItem: Stripe.SubscriptionItem) => newItem.price.id === oldItem.price.id))) throw new ConflictError("Already subscribed");

    const newSubscription = await handlePatchSubscription(id, { items, ...body });
    res.status(200).json(newSubscription);
  }
);

export type ApiDeleteSubscriptionQuery =
  & Stripe.SubscriptionCancelParams
  & { id: string };
export type ApiDeleteSubscriptionResponse = Awaited<ReturnType<typeof handleDeleteSubscription>>;

export async function handleDeleteSubscription(id: string, query: Omit<ApiDeleteSubscriptionQuery, "id">) {
  return await stripeApiClient.subscriptions.cancel(id, query);
}

handler.delete(
  authorization({ isSubscriber: true }),
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