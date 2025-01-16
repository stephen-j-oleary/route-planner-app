import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Stack } from "@mui/material";

import { getUserSubscriptions } from "@/app/api/user/subscriptions/actions";
import SubscriptionPlanCurrent from "@/components/Subscriptions/Plan/Current";
import SubscriptionPlanSelect from "@/components/Subscriptions/Plan/Select";
import { PageProps } from "@/types/next";
import { auth } from "@/utils/auth";
import pages from "pages";


export default async function SubscriptionPlansPage({
  searchParams,
}: PageProps) {
  let { callbackUrl } = searchParams;
  callbackUrl = typeof callbackUrl === "string" ? callbackUrl : undefined;

  if (callbackUrl?.startsWith(pages.subscribe)) redirect(callbackUrl);

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