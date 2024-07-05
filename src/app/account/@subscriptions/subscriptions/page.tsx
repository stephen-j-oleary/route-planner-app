import { cookies } from "next/headers";

import { handleGetUserSubscriptions } from "@/app/api/user/subscriptions/route";
import SubscriptionsList from "@/components/Subscriptions/List";
import PageSection from "@/components/ui/PageSection";
import { auth } from "@/utils/auth/server";


export default async function SubscriptionsPage() {
  const { customerId } = await auth(cookies());
  const subscriptions = customerId ? await handleGetUserSubscriptions({ customer: customerId }) : [];


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