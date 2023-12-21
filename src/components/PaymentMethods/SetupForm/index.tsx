import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { useQuery } from "react-query";

import { Paper, PaperProps } from "@mui/material";

import { useCreateCheckoutSession } from "@/reactQuery/useCheckoutSession";
import { stripeAppClient } from "@/utils/stripeClient";


export type PaymentMethodSetupFormProps = PaperProps;

export default function PaymentMethodSetupForm(props: PaymentMethodSetupFormProps) {
  const createCheckoutSessionMutation = useCreateCheckoutSession();

  const clientSecret = useQuery({
    queryKey: ["checkoutSession"],
    queryFn: async () => createCheckoutSessionMutation.mutateAsync({
      ui_mode: "embedded",
      mode: "setup",
      currency: "cad",
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
        stripe={stripeAppClient}
        options={{
          clientSecret: clientSecret.data,
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </Paper>
  );
}