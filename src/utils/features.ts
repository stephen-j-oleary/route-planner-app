import "server-only";

import { getUserActiveEntitlements } from "@/app/api/user/entitlements/actions";


export const features = {
  /** Save routes for later */
  routes_save: "routes_save",
  /** Routes up to 10 stops */
  routes_basic: "routes_basic",
  /** Routes up to 100 stops */
  routes_premium: "routes_premium",
};


export async function checkFeature(lookupKey: string) {
  const activeEntitlements = await getUserActiveEntitlements();
  if (!activeEntitlements.length) return false;

  return activeEntitlements.some(item => item.lookup_key === lookupKey);
}