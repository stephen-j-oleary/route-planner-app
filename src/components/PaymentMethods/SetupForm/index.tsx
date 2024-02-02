import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { useQuery } from "react-query";

import { Paper, PaperProps } from "@mui/material";

import { useCreateUserCheckoutSession } from "@/reactQuery/useCheckoutSession";
import stripeClientReact from "@/utils/stripeClient/react";


export type PaymentMethodSetupFormProps = PaperProps;

export default function PaymentMethodSetupForm(props: PaymentMethodSetupFormProps) {
  const createCheckoutSessionMutation = useCreateUserCheckoutSession();

  const clientSecret = useQuery({
    queryKey: ["checkoutSession"],
    queryFn: async () => createCheckoutSessionMutation.mutateAsync({
      ui_mode: "embedded",
      mode: "setup",
      return_url: "/account",
    }),
    select: data => data.client_secret,
    refetchOnWindowFocus: false,
  });

  return (
    <Paper
      role="form"
      sx={{ padding: 2 }}
      {...props}
    >
      <EmbeddedCheckoutProvider
        stripe={stripeClientReact}
        options={{
          clientSecret: clientSecret.data ?? null,
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </Paper>
  );
}