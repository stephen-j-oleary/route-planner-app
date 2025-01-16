import { cookies } from "next/headers";

import { Stack } from "@mui/material";

import { getUserSubscriptions } from "@/app/api/user/subscriptions/actions";
import SubscriptionPlanCurrent from "@/components/Subscriptions/Plan/Current";
import SubscriptionPlanSelect from "@/components/Subscriptions/Plan/Select";
import { auth } from "@/utils/auth";


export default async function SubscriptionPlansPage() {
  const { customerId } = await auth(cookies());
  const subscriptions = customerId ? await getUserSubscriptions({ customer: customerId }) : [];

  return (
    <Stack spacing={3}>
      <SubscriptionPlanCurrent
        subscriptions={subscriptions}
      />

      <SubscriptionPlanSelect
        subscriptions={subscriptions}
      />
    </Stack>
  );
}

export const metadata = {
  title: "Loop Mapping - Plans",
};