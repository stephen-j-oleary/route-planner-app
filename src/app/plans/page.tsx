import { cookies } from "next/headers";

import { getPrices } from "@/app/api/prices/actions";
import { getUserSubscriptions } from "@/app/api/user/subscriptions/actions";
import SubscriptionPlanSelect from "@/components/Subscriptions/PlanSelect";
import { StripePriceActiveExpandedProduct } from "@/models/Price";
import { auth } from "@/utils/auth";


export default async function SubscriptionPlansPage() {
  const { customerId } = await auth(cookies());

  const subscriptions = customerId ? await getUserSubscriptions({ customer: customerId }) : [];
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