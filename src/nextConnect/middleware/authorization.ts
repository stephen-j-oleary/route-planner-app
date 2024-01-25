import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";

import { handleGetSubscriptions } from "@/pages/api/pay/subscriptions";
import { handleGetUserById } from "@/pages/api/users/[id]";
import { AuthError } from "@/utils/ApiErrors";
import { getAuthUser } from "@/utils/auth/serverHelpers";


export type AuthorizationLocals = {
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

  return async function(req: NextApiRequest, res: NextApiResponse & { locals: AuthorizationLocals }, next: NextHandler) {
    // Create res.locals if it doesn't exist
    res.locals ??= {};

    const user = await getAuthUser(req, res);
    const userId = user?.id;
    res.locals.userId = userId;
    if (isUser && !userId) throw new AuthError("User required");

    const customerId = (user && (user.customerId || (await handleGetUserById(user.id))?.customerId)) ?? undefined;
    res.locals.customerId = customerId;
    if (isCustomer && !customerId) throw new AuthError("Customer required");

    const subscriptions = await handleGetSubscriptions({ customer: customerId || undefined });
    res.locals.subscriptionIds = subscriptions?.map(item => item.id);
    if (isSubscriber && !subscriptions?.length) throw new AuthError("Subscription required");

    // TODO: Get subscription items from every subscription
    const subscriptionItems = subscriptions[0].items?.data;
    res.locals.subscriptionItemIds = subscriptionItems.map(item => item.id);
    if (isSubscriber && !subscriptionItems?.length) throw new AuthError("Subscription required");

    return next();
  }
}