import { cookies } from "next/headers";

import { handleGetUserSubscriptions } from "../api/user/subscriptions/route";
import { handleGetPrices } from "@/app/api/prices/handlers";
import SubscriptionPlanSelect from "@/components/Subscriptions/PlanSelect";
import { StripePriceActiveExpandedProduct } from "@/models/Price";
import { auth } from "@/utils/auth/server";


export default async function SubscriptionPlansPage() {
  const { customerId } = await auth(cookies());

  const subscriptions = customerId ? await handleGetUserSubscriptions({ customer: customerId }) : [];
  const prices = await handleGetPrices({ active: true, expand: ["data.product"] }) as StripePriceActiveExpandedProduct[];

  return (
    <SubscriptionPlanSelect
      activeSubscriptions={subscriptions}
      activePrices={prices}
    />
  );
}

export const metadata = {
  title: "Loop Mapping - Plans",
};