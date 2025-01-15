import stripeClientNext from "./stripeClient/next";
import { auth, AuthContext } from "@/utils/auth";


export const features = {
  /** Save routes for later */
  routes_save: "routes_save",
  /** Routes up to 10 stops */
  routes_basic: "routes_basic",
  /** Routes up to 100 stops */
  routes_premium: "routes_premium",
};



export async function hasFeatureAccess(lookupKey: string, ctx: AuthContext) {
  const { customerId } = await auth(ctx);
  if (!customerId) return false;

  const activeEntitlements = (await stripeClientNext.entitlements.activeEntitlements.list({ customer: customerId })).data;
  if (!activeEntitlements.length) return false;

  return activeEntitlements.some(item => item.lookup_key === lookupKey);
}