import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";

import { handleGetUser } from "@/pages/api/user";
import { handleGetUserSubscriptions } from "@/pages/api/user/subscriptions";
import { AuthError } from "@/utils/ApiErrors";
import { getAuthUser } from "@/utils/auth/serverHelpers";


export type AuthorizedType = {
  userId?: string,
  customerId?: string,
  subscriptionIds?: string[],
  subscriptionItemIds?: string[],
};
export type AuthorizationOptions = {
  isSubscriber?: boolean,
  isCustomer?: boolean,
  isUser?: boolean,
};


/**
 * Handles authorization
 * Sets authorization values on req.locals.authorized as type AuthorizedType
 */
export default function authorization({
  isSubscriber = false,
  isCustomer = false,
  isUser = false,
}: AuthorizationOptions) {
  if (isSubscriber) isCustomer = true;
  if (isCustomer) isUser = true;

  return async function(req: NextApiRequest, res: NextApiResponse, next: NextHandler) {
    const authorized: AuthorizedType = {};

    const user = await getAuthUser(req, res);
    const userId = user?.id;
    authorized.userId = userId;
    req.locals.authorized = authorized;
    if (isUser && !userId) throw new AuthError("User required");

    const customerId = (user && (user.customerId || (await handleGetUser(user.id))?.customerId)) ?? undefined;
    authorized.customerId = customerId;
    req.locals.authorized = authorized;
    if (isCustomer && !customerId) throw new AuthError("Customer required");

    const subscriptions = customerId ? await handleGetUserSubscriptions({ customer: customerId }) : [];
    authorized.subscriptionIds = subscriptions?.map(item => item.id);
    req.locals.authorized = authorized;
    if (isSubscriber && !subscriptions?.length) throw new AuthError("Subscription required");

    // TODO: Get subscription items from every subscription
    const subscriptionItems = subscriptions[0]?.items.data || [];
    authorized.subscriptionItemIds = subscriptionItems.map(item => item.id);
    req.locals.authorized = authorized;
    if (isSubscriber && !subscriptionItems?.length) throw new AuthError("Subscription required");

    return next();
  }
}