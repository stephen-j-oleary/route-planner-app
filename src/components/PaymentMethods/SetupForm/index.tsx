import "server-only";

import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";

import { Paper, PaperProps } from "@mui/material";

import { createUserCheckoutSession } from "@/services/checkoutSessions";
import stripeClientReact from "@/utils/stripeClient/react";


export type PaymentMethodSetupFormProps = PaperProps;

export default async function PaymentMethodSetupForm(props: PaymentMethodSetupFormProps) {
  const { client_secret: clientSecret } = await createUserCheckoutSession({
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