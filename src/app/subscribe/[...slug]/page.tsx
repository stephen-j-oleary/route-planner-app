import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import Stripe from "stripe";

import { getPrices } from "@/app/api/prices/actions";
import { postUserBillingPortal } from "@/app/api/user/billingPortal/actions";
import { postUserCheckoutSession } from "@/app/api/user/checkoutSession/actions";
import { getUserSubscriptionById } from "@/app/api/user/subscriptions/[id]/actions";
import { getUserSubscriptions, postUserSubscription } from "@/app/api/user/subscriptions/actions";
import CheckoutForm from "@/components/CheckoutForm";
import { StripePriceExpandedProduct } from "@/models/Price";
import { PageProps } from "@/types/next";
import { auth, authRedirect } from "@/utils/auth";
import pojo from "@/utils/pojo";
import pages from "pages";


const isActiveRecurringPrice = (price: Stripe.Price): price is Stripe.Price & { product: Stripe.Product, unit_amount: number, recurring: Stripe.Price.Recurring } => (
  price.active
    && !(price.product as Stripe.Product).deleted
    && !!price.recurring
);

export default async function SubscribePage({
  searchParams,
  params,
}: PageProps<{ slug: string[] }>) {
  let { callbackUrl } = searchParams;
  callbackUrl = typeof callbackUrl === "string" ? callbackUrl : pages.plans;

  const { userId, email, customerId } = await auth(cookies());
  if (!userId) authRedirect(pages.login);

  const subscriptions = customerId ? await getUserSubscriptions({ customer: customerId }) : [];

  if (subscriptions.length) {
    const billingPortal = (customerId && subscriptions.length) ? await postUserBillingPortal({ customer: customerId!, return_url: callbackUrl }) : null;
    if (billingPortal) redirect(billingPortal.url, RedirectType.replace);
  }

  const { slug } = params;

  const priceId = (slug?.length === 2 && slug[0] === "id") ? slug[1] : undefined;
  const lookupKey = (slug?.length === 1) ? slug[0] : undefined;

  const [price] = await getPrices({
    id: priceId,
    lookup_keys: lookupKey ? [lookupKey] : undefined,
    expand: ["data.product"],
  }) as StripePriceExpandedProduct[];
  if (!price) throw new Error("Plan not found");
  if (!isActiveRecurringPrice(price)) throw new Error("Plan not available");

  const subscriptionItems = [{
    price: price.id,
    quantity: 1,
  }];

  const checkoutSession = pojo(
    await postUserCheckoutSession({
      customer: customerId || undefined,
      customer_email: !customerId && email || undefined,
      ui_mode: "embedded",
      mode: "subscription",
      line_items: subscriptionItems,
      return_url: callbackUrl,
    })
  );

  if (!checkoutSession) throw new Error("Failed to start checkout. Please try again");

  if (price.unit_amount === 0) {
    let subscription = await postUserSubscription({ price: price.id });

    // Wait for subscription to become active
    while (subscription.status !== "active") {
      subscription = await getUserSubscriptionById(subscription.id);
    }

    revalidatePath(pages.root, "layout");
    redirect(callbackUrl, RedirectType.push);
  }

  return (
    <CheckoutForm
      checkoutSession={checkoutSession}
    />
  );
}

export const metadata = {
  title: "Loop Mapping - Subscribe",
};