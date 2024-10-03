import "server-only";

import { cookies } from "next/headers";

import { Paper, PaperProps } from "@mui/material";

import { StripeCheckout, StripeCheckoutProvider } from "./Stripe";
import { postUserCheckoutSession } from "@/app/api/user/checkoutSession/actions";
import { auth } from "@/utils/auth";
import stripeClientReact from "@/utils/stripeClient/react";


export type PaymentMethodSetupFormProps = PaperProps;

export default async function PaymentMethodSetupForm(props: PaymentMethodSetupFormProps) {
  const { customerId, email } = await auth(cookies());

  const { client_secret: clientSecret } = await postUserCheckoutSession({
    customer: customerId || undefined,
    customer_email: !customerId && email || undefined,
    ui_mode: "embedded",
    mode: "setup",
    return_url: "/account",
  });

  return (
    <Paper
      role="form"
      sx={{ padding: 2 }}
      {...props}
    >
      <StripeCheckoutProvider
        stripe={stripeClientReact}
        options={{ clientSecret }}
      >
        <StripeCheckout />
      </StripeCheckoutProvider>
    </Paper>
  );
}