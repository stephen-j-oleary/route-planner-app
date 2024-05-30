import { cookies } from "next/headers";

import SubscriptionsList from "@/components/Subscriptions/List";
import { getUserSubscriptions } from "@/services/subscriptions";
import { auth } from "@/utils/auth";


export default async function Page() {
  const { customerId } = await auth(cookies());
  const subscriptions = customerId ? await getUserSubscriptions() : [];

  return (
    <SubscriptionsList
      subscriptions={subscriptions}
      visible={3}
    />
  );
}