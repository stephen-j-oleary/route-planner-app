"use client";

import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import Stripe from "stripe";

import stripeClientReact from "@/utils/stripeClient/react";


export type CheckoutFormNewSubscriptionProps = {
  checkoutSession: Stripe.Checkout.Session,
};

export default function CheckoutFormNewSubscription({
  checkoutSession,
}: CheckoutFormNewSubscriptionProps) {
  return (
    <EmbeddedCheckoutProvider
      stripe={stripeClientReact}
      options={{ clientSecret: checkoutSession.client_secret }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}