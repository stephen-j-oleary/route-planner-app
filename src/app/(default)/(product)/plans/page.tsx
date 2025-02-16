import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getPrices } from "@/app/api/prices/actions";
import { getProductById } from "@/app/api/products/[id]/actions";
import { getUserSubscriptions } from "@/app/api/user/subscriptions/actions";
import SubscriptionPlanSelect from "@/components/Subscriptions/Plan/Select";
import { StripePriceActiveExpandedProduct } from "@/models/Price";
import pages from "@/pages";
import { PageProps } from "@/types/next";
import auth from "@/utils/auth";
import { getCallbackUrl } from "@/utils/auth/utils";
import { Pojo } from "@/utils/pojo";


export default async function SubscriptionPlansPage({
  searchParams,
}: PageProps) {
  const session = await auth(pages.plans).session();
  const callbackUrl = getCallbackUrl(searchParams);
  // Auth next
  if (callbackUrl?.startsWith(pages.subscribe)) redirect(callbackUrl);

  const subscriptions = await getUserSubscriptions().catch(() => []);
  const prices = await getPrices({ active: true, expand: ["data.product"] }) as Pojo<StripePriceActiveExpandedProduct[]>;
  const subscribedProduct = subscriptions.length ? await getProductById(subscriptions[0].items.data[0].price.product as string) : null;

  return (
    <SubscriptionPlanSelect
      hasSession={!!session?.user?.id}
      callbackUrl={callbackUrl}
      prices={prices}
      subscriptions={subscriptions}
      subscribedProduct={subscribedProduct}
    />
  );
}

export const metadata: Metadata = {
  title: "Loop Mapping - Plans",
  description: "Explore Loop Mapping's pricing plans. Find the perfect plan for your needs with flexible options and great features to help with your next trip.",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_BASE_URL}${pages.plans}` },
};