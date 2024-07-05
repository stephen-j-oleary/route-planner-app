import { cookies } from "next/headers";

import { handleGetUserSubscriptions } from "@/app/api/user/subscriptions/route";
import SubscriptionsList from "@/components/Subscriptions/List";
import { auth } from "@/utils/auth/server";


export default async function Page() {
  const { customerId } = await auth(cookies());
  const subscriptions = customerId ? await handleGetUserSubscriptions({ customer: customerId }) : [];

  return (
    <SubscriptionsList
      subscriptions={subscriptions}
      visible={3}
    />
  );
}