import type { Metadata } from "next";
import Stripe from "stripe";

import { getPrices } from "@/app/api/prices/actions";
import { postUserCheckoutSession } from "@/app/api/user/checkoutSession/actions";
import CheckoutForm from "@/components/CheckoutForm";
import SubscribeForm from "@/components/Subscriptions/SubscribeForm";
import { StripePriceExpandedProduct } from "@/models/Price";
import pages from "@/pages";
import { PageProps } from "@/types/next";
import auth from "@/utils/auth";
import { parseSearchParams } from "@/utils/auth/utils";
import { Pojo } from "@/utils/pojo";


const isActiveRecurringPrice = (price: Stripe.Price): price is Stripe.Price & { product: Stripe.Product, unit_amount: number, recurring: Stripe.Price.Recurring } => (
  price.active
    && !(price.product as Stripe.Product).deleted
    && !!price.recurring
);

export default async function SubscribePage({
  searchParams,
  params,
}: PageProps<{ key: string }>) {
  const { callbackUrl } = await parseSearchParams(searchParams, pages.subscribe);

  const { user: { email } = {}, customer: { id: customerId } = {} } = await auth(pages.subscribe).flow({ searchParams });

  const { key } = await params;

  const price = (
    (await getPrices({
      lookup_keys: [key],
      expand: ["data.product"],
    }))[0]
    ?? (await getPrices({
      id: key,
      expand: ["data.product"],
    }))[0]
  ) as Pojo<StripePriceExpandedProduct> | undefined;

  if (!price) throw new Error("Plan not found");
  if (!isActiveRecurringPrice(price)) throw new Error("Plan not available");

  if (price.unit_amount === 0) {
    return (
      <SubscribeForm
        price={price}
      />
    );
  }
  else {
    const subscriptionItems = [{
      price: price.id,
      quantity: 1,
    }];

    const checkoutSession = await postUserCheckoutSession({
      customer: customerId || undefined,
      customer_email: !customerId && email || undefined,
      ui_mode: "embedded",
      mode: "subscription",
      line_items: subscriptionItems,
      return_url: callbackUrl,
    });

    if (!checkoutSession) throw new Error("Failed to start checkout. Please try again");

    return (
      <CheckoutForm
        checkoutSession={checkoutSession}
      />
    );
  }
}

export const metadata: Metadata = {
  robots: { index: false },
  title: "Loop Mapping - Subscribe",
  description: "Subscribe to Loop Mapping for full access to our features and services. Start enjoying the benefits today with a subscription that fits your needs.",
};