import "server-only";

import { cookies } from "next/headers";
import Stripe from "stripe";

import { Paper, PaperProps } from "@mui/material";

import { postUserCheckoutSession } from "@/app/api/user/checkoutSession/actions";
import CheckoutFormChangeSubscription from "@/components/CheckoutForm/ChangeSubscription";
import CheckoutFormNewSubscription from "@/components/CheckoutForm/NewSubscription";
import { auth } from "@/utils/auth";
import { postUserUpcomingInvoice } from "@/app/api/user/invoices/upcoming/actions";


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

  const subscriptionItems = [{
    id: activeSubscriptions[0]?.items.data[0]?.id || undefined,
    price: price.id,
    quantity: 1,
  }];

  const changePreview = hasSubscription
    ? await postUserUpcomingInvoice({
      subscription: activeSubscriptions[0]!.id,
      subscription_items: subscriptionItems,
      subscription_proration_date: new Date(),
    })
    : null;

  const checkoutSession = !hasSubscription
    ? await postUserCheckoutSession({
      customer: customerId || undefined,
      customer_email: !customerId && email || undefined,
      ui_mode: "embedded",
      mode: "subscription",
      line_items: subscriptionItems,
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
              newSubscriptionItems={subscriptionItems}
              changePreview={JSON.parse(JSON.stringify(changePreview))}
            />
          )
          : (
            <CheckoutFormNewSubscription
              checkoutSession={JSON.parse(JSON.stringify(checkoutSession))}
            />
          )
      }
    </Paper>
  );
}