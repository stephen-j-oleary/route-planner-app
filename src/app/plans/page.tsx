import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getPrices } from "@/app/api/prices/actions";
import { getProductById } from "@/app/api/products/[id]/actions";
import { getUserSubscriptions } from "@/app/api/user/subscriptions/actions";
import SubscriptionPlanSelect from "@/components/Subscriptions/Plan/Select";
import { StripePriceActiveExpandedProduct } from "@/models/Price";
import pages from "@/pages";
import { PageProps } from "@/types/next";
import { auth } from "@/utils/auth";
import pojo from "@/utils/pojo";


export default async function SubscriptionPlansPage({
  searchParams,
}: PageProps) {
  let { callbackUrl } = searchParams;
  callbackUrl = typeof callbackUrl === "string" ? callbackUrl : undefined;

  if (callbackUrl?.startsWith(pages.subscribe)) redirect(callbackUrl);

  const { customerId } = await auth(cookies());
  const subscriptions = customerId ? pojo(await getUserSubscriptions({ customer: customerId })) : [];
  const prices = pojo(await getPrices({ active: true, expand: ["data.product"] }) as StripePriceActiveExpandedProduct[]);
  const subscribedProduct = subscriptions.length ? pojo(await getProductById(subscriptions[0].items.data[0].price.product as string)) : null;

  return (
    <SubscriptionPlanSelect
      callbackUrl={callbackUrl}
      prices={prices}
      subscriptions={subscriptions}
      subscribedProduct={subscribedProduct}
    />
  );
}

export const metadata = {
  title: "Loop Mapping - Plans",
};