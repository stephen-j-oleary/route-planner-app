import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import SubscriptionsList from "@/components/Subscriptions/List";
import PageSection from "@/components/ui/PageSection";
import { getUserSubscriptions } from "@/services/subscriptions";
import { auth } from "@/utils/auth/server";


export default async function SubscriptionsPage() {
  const { userId, customerId } = await auth(cookies());
  if (!userId) redirect("/login");

  const subscriptions = customerId ? await getUserSubscriptions() : [];


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