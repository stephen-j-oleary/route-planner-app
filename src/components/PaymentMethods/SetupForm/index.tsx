import "server-only";

import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { cookies } from "next/headers";

import { Paper, PaperProps } from "@mui/material";

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
      <EmbeddedCheckoutProvider
        stripe={stripeClientReact}
        options={{ clientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </Paper>
  );
}