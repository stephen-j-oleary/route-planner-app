import { cookies } from "next/headers";

import SubscriptionPlanSelect from "@/components/Subscriptions/PlanSelect";
import { StripePriceActiveExpandedProduct } from "@/models/Price";
import { getPrices } from "@/services/prices";
import { getUserSubscriptions } from "@/services/subscriptions";
import { auth } from "@/utils/auth/server";


export default async function SubscriptionPlansPage() {
  const { customerId } = await auth(cookies());

  const subscriptions = customerId ? await getUserSubscriptions() : [];
  const prices = await getPrices({ active: true, expand: ["data.product"] }) as StripePriceActiveExpandedProduct[];

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