import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";

import { handleGetSubscriptions } from "@/pages/api/pay/subscriptions";
import { handleGetUserById } from "@/pages/api/users/[id]";
import { AuthError } from "@/utils/ApiErrors";
import { getAuthUser } from "@/utils/auth/serverHelpers";

export type AuthOptions = {
  requireAccount: boolean,
  requireSubscription: boolean,
};

export default function authMiddleware({
  requireAccount,
  requireSubscription,
}: AuthOptions) {
  return async function(req: NextApiRequest, res: NextApiResponse, next: NextHandler) {
    const account = await getAuthUser(req, res);
    if (requireAccount && !account) throw new AuthError("Account required");

    const customerId = account && (account.customerId || (await handleGetUserById(account.id))?.customerId);
    if (requireSubscription && !customerId) throw new AuthError("Subscription required");

    const subscriptions = await handleGetSubscriptions({ customer: customerId || undefined });
    if (requireSubscription && !subscriptions?.length) throw new AuthError("Subscription required");

    const subscriptionItem = subscriptions[0].items?.data?.[0];
    if (requireSubscription && !subscriptionItem) throw new AuthError("Subscription required");

    return next();
  }
}