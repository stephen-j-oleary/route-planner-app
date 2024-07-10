import { cookies } from "next/headers";

import { getUserSubscriptions } from "@/app/api/user/subscriptions/actions";
import SubscriptionsList from "@/components/Subscriptions/List";
import PageSection from "@/components/ui/PageSection";
import { auth } from "@/utils/auth";


export default async function SubscriptionsPage() {
  const { customerId } = await auth(cookies());
  const subscriptions = customerId ? await getUserSubscriptions({ customer: customerId }) : [];


  return (
    <PageSection
      title="Subscriptions"
      body={
        <SubscriptionsList
          subscriptions={subscriptions}
          visible={6}
        />
      }
    />
  );
}

export const metadata = {
  title: "Loop Mapping - Subscriptions",
};