import { cookies } from "next/headers";

import { getPrices } from "@/app/api/prices/actions";
import { getUserSubscriptions } from "@/app/api/user/subscriptions/actions";
import SubscriptionsList from "@/components/Subscriptions/List";
import { StripePriceActiveExpandedProduct } from "@/models/Price";
import { auth } from "@/utils/auth";
import pojo from "@/utils/pojo";


export default async function Page() {
  const { customerId } = await auth(cookies());
  const subscriptions = customerId ? pojo(await getUserSubscriptions({ customer: customerId })) : [];
  const prices = customerId ? pojo(await getPrices({ active: true, expand: ["data.product"] }) as StripePriceActiveExpandedProduct[]) : [];

  return (
    <SubscriptionsList
      subscriptions={subscriptions}
      prices={prices}
      visible={3}
    />
  );
}