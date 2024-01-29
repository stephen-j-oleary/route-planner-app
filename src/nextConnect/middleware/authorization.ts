import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";

import { handleGetSubscriptions } from "@/pages/api/pay/subscriptions";
import { handleGetUser } from "@/pages/api/user";
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

export default function authorization({
  isSubscriber = false,
  isCustomer = false,
  isUser = false,
}: AuthorizationOptions) {
  if (isSubscriber) isCustomer = true;
  if (isCustomer) isUser = true;

  return async function(req: NextApiRequest, res: NextApiResponse, next: NextHandler) {
    const user = await getAuthUser(req, res);
    const userId = user?.id;
    req.locals.userId = userId;
    if (isUser && !userId) throw new AuthError("User required");

    const customerId = (user && (user.customerId || (await handleGetUser(user.id))?.customerId)) ?? undefined;
    req.locals.customerId = customerId;
    if (isCustomer && !customerId) throw new AuthError("Customer required");

    const subscriptions = await handleGetSubscriptions({ customer: customerId || undefined });
    req.locals.subscriptionIds = subscriptions?.map(item => item.id);
    if (isSubscriber && !subscriptions?.length) throw new AuthError("Subscription required");

    // TODO: Get subscription items from every subscription
    const subscriptionItems = subscriptions[0].items?.data;
    req.locals.subscriptionItemIds = subscriptionItems.map(item => item.id);
    if (isSubscriber && !subscriptionItems?.length) throw new AuthError("Subscription required");

    return next();
  }
}