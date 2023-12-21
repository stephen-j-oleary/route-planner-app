import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { useQuery } from "react-query";

import { useCreateCheckoutSession } from "@/reactQuery/useCheckoutSession";
import { stripeAppClient } from "@/utils/stripeClient";


export type CheckoutFormNewSubscriptionProps = {
  newPrice: {
    id: string,
  },
}

export default function CheckoutFormNewSubscription({
  newPrice,
}: CheckoutFormNewSubscriptionProps) {
  const createCheckoutSessionMutation = useCreateCheckoutSession();

  const clientSecret = useQuery({
    queryKey: ["checkoutSession", newPrice.id],
    queryFn: async () => createCheckoutSessionMutation.mutateAsync({
      ui_mode: "embedded",
      mode: "subscription",
      line_items: [{
        price: newPrice.id,
        quantity: 1,
      }],
      return_url: "/account/subscriptions",
    }),
    select: data => data.client_secret,
    refetchOnWindowFocus: false,
  });

  return (
    <EmbeddedCheckoutProvider
      stripe={stripeAppClient}
      options={{
        clientSecret: clientSecret.data,
      }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}