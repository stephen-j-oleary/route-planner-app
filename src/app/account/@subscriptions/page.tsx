import { cookies } from "next/headers";

import { getUserSubscriptions } from "@/app/api/user/subscriptions/actions";
import SubscriptionsList from "@/components/Subscriptions/List";
import { auth } from "@/utils/auth";


export default async function Page() {
  const { customerId } = await auth(cookies());
  const subscriptions = customerId ? await getUserSubscriptions({ customer: customerId }) : [];

  return (
    <SubscriptionsList
      subscriptions={subscriptions}
      visible={3}
    />
  );
}