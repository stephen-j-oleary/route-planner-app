import { cookies } from "next/headers";

import { getPrices } from "@/app/api/prices/actions";
import { getUserSubscriptions } from "@/app/api/user/subscriptions/actions";
import SubscriptionsList from "@/components/Subscriptions/List";
import PageSection from "@/components/ui/PageSection";
import { StripePriceActiveExpandedProduct } from "@/models/Price";
import { auth } from "@/utils/auth";


export default async function SubscriptionsPage() {
  const { customerId } = await auth(cookies());
  const subscriptions = customerId ? await getUserSubscriptions({ customer: customerId }) : [];
  const prices = await getPrices({ active: true, expand: ["data.product"] }) as StripePriceActiveExpandedProduct[];


  return (
    <PageSection
      title="Subscriptions"
      body={
        <SubscriptionsList
          subscriptions={subscriptions}
          prices={prices}
          visible={6}
        />
      }
    />
  );
}

export const metadata = {
  title: "Loop Mapping - Subscriptions",
};