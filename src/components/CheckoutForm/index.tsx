"use client";

import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import Stripe from "stripe";

import stripeClientReact from "@/utils/stripeClient/react";


export type CheckoutFormProps = {
  checkoutSession: Stripe.Checkout.Session,
};

export default function CheckoutForm({
  checkoutSession,
}: CheckoutFormProps) {
  return (
    <EmbeddedCheckoutProvider
      stripe={stripeClientReact}
      options={{ clientSecret: checkoutSession.client_secret }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}