import { cookies } from "next/headers";

import { getUserSubscriptions } from "@/app/api/user/subscriptions/actions";
import SubscriptionsList from "@/components/Subscriptions/List";
import { auth } from "@/utils/auth";
import { StripePriceActiveExpandedProduct } from "@/models/Price";
import { getPrices } from "@/app/api/prices/actions";


export default async function Page() {
  const { customerId } = await auth(cookies());
  const subscriptions = customerId ? await getUserSubscriptions({ customer: customerId }) : [];
  const prices = await getPrices({ active: true, expand: ["data.product"] }) as StripePriceActiveExpandedProduct[];

  return (
    <SubscriptionsList
      subscriptions={subscriptions}
      prices={prices}
      visible={3}
    />
  );
}