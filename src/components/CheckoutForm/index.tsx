import "server-only";

import { cookies } from "next/headers";
import Stripe from "stripe";

import { Paper, PaperProps } from "@mui/material";

import { postUserCheckoutSession } from "@/app/api/user/checkoutSession/actions";
import CheckoutFormChangeSubscription from "@/components/CheckoutForm/ChangeSubscription";
import CheckoutFormNewSubscription from "@/components/CheckoutForm/NewSubscription";
import { auth } from "@/utils/auth";


export type CheckoutFormProps =
  & PaperProps
  & {
    price: {
      id: string,
      unit_amount: number,
      currency: string,
      product: { name: string },
      recurring: {
        interval: string,
        interval_count: number,
      },
    },
    activeSubscriptions: Stripe.Subscription[],
  };

export default async function CheckoutForm({
  price,
  activeSubscriptions,
  ...props
}: CheckoutFormProps) {
  const { email, customerId } = await auth(cookies());

  const hasSubscription = !!activeSubscriptions.length;

  const checkoutSession = !hasSubscription
    ? await postUserCheckoutSession({
      customer: customerId || undefined,
      customer_email: !customerId && email || undefined,
      ui_mode: "embedded",
      mode: "subscription",
      line_items: [{ price: price.id, quantity: 1 }],
      return_url: "/account/subscriptions",
    })
    : null;


  return (
    <Paper
      role="form"
      sx={{ padding: 2 }}
      {...props}
    >
      {
        hasSubscription
          ? (
            <CheckoutFormChangeSubscription
              activeSubscriptions={activeSubscriptions}
              newPrice={price}
            />
          )
          : (
            <CheckoutFormNewSubscription
              checkoutSession={JSON.parse(JSON.stringify(checkoutSession)) as Stripe.Checkout.Session}
            />
          )
      }
    </Paper>
  );
}