import stripeClientNext from "./stripeClient/next";
import { auth, AuthContext } from "@/utils/auth";


export const ROUTES_SAVE = "routes_save";

export async function hasFeatureAccess(lookupKey: string, ctx: AuthContext) {
  const { customerId } = await auth(ctx);
  if (!customerId) return false;

  const activeEntitlements = (await stripeClientNext.entitlements.activeEntitlements.list({ customer: customerId })).data;
  if (!activeEntitlements.length) return false;

  return activeEntitlements.some(item => item.lookup_key === lookupKey);
}