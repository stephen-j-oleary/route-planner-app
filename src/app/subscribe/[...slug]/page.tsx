import { cookies } from "next/headers";
import Stripe from "stripe";

import { getPriceById } from "@/app/api/prices/[id]/actions";
import { getPrices } from "@/app/api/prices/actions";
import { getUserSubscriptions } from "@/app/api/user/subscriptions/actions";
import SubscribeForm from "@/components/Subscriptions/Subscribe";
import { StripePriceExpandedProduct } from "@/models/Price";
import { PageProps } from "@/types/next";
import { auth, authRedirect } from "@/utils/auth";
import pages from "pages";


const isActiveRecurringPrice = (price: Stripe.Price): price is Stripe.Price & { product: Stripe.Product, unit_amount: number, recurring: Stripe.Price.Recurring } => (
  price.active
    && !(price.product as Stripe.Product).deleted
    && !!price.unit_amount
    && !!price.recurring
);

export default async function SubscribePage({
  params,
}: PageProps<{ slug: string[] }>) {
  const { userId, customerId } = await auth(cookies());
  if (!userId) authRedirect(pages.login);

  const subscriptions = customerId ? await getUserSubscriptions({ customer: customerId }) : [];

  const { slug } = params;

  const priceId = (slug?.length === 2 && slug[0] === "id") ? slug[1] : null;
  const lookupKey = (slug?.length === 1) ? slug[0] : null;

  const priceById = priceId
    ? await getPriceById(
      priceId,
      { expand: ["product"] },
    )
    : null;
  const priceByLookupKey = lookupKey
    ? (await getPrices({
      lookup_keys: [lookupKey],
      expand: ["data.product"],
    }))[0]
    : null;
  const price = (priceById || priceByLookupKey) as StripePriceExpandedProduct || null;
  if (!price) throw new Error("Plan not found");
  if (!isActiveRecurringPrice(price)) throw new Error("Plan not available");

  return (
    <SubscribeForm
      price={price}
      activeSubscriptions={subscriptions}
    />
  );
}

export const metadata = {
  title: "Loop Mapping - Subscribe",
};