import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { useQuery } from "react-query";

import { useCreateUserCheckoutSession } from "@/reactQuery/useCheckoutSession";
import stripeClientReact from "@/utils/stripeClient/react";


export type CheckoutFormNewSubscriptionProps = {
  newPrice: {
    id: string,
  },
}

export default function CheckoutFormNewSubscription({
  newPrice,
}: CheckoutFormNewSubscriptionProps) {
  const createCheckoutSessionMutation = useCreateUserCheckoutSession();

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
      stripe={stripeClientReact}
      options={{
        clientSecret: clientSecret.data ?? null,
      }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}