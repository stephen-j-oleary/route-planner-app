import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Stripe from "stripe";

import { handleGetPriceById } from "@/app/api/prices/[id]/handlers";
import { handleGetPrices } from "@/app/api/prices/handlers";
import { handleGetUserSubscriptions } from "@/app/api/user/subscriptions/route";
import CheckoutForm from "@/components/CheckoutForm";
import { StripePriceExpandedProduct } from "@/models/Price";
import { PageProps } from "@/types/next";
import { auth } from "@/utils/auth/server";


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
  if (!userId) redirect("/login");

  const subscriptions = customerId ? await handleGetUserSubscriptions({ customer: customerId }) : [];

  const { slug } = params;

  const priceId = (slug?.length === 2 && slug[0] === "id") ? slug[1] : null;
  const lookupKey = (slug?.length === 1) ? slug[0] : null;

  const priceById = priceId
    ? await handleGetPriceById(
      priceId,
      { expand: ["product"] },
    )
    : null;
  const priceByLookupKey = lookupKey
    ? (await handleGetPrices({
      lookup_keys: [lookupKey],
      expand: ["data.product"],
    }))[0]
    : null;
  const price = (priceById || priceByLookupKey) as StripePriceExpandedProduct || null;
  if (!price) throw new Error("Plan not found");
  if (!isActiveRecurringPrice(price)) throw new Error("Plan not available");

  return (
    <CheckoutForm
      price={price}
      activeSubscriptions={subscriptions}
    />
  );
}

export const metadata = {
  title: "Loop Mapping - Subscribe",
};