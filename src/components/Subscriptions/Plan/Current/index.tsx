import Stripe from "stripe";

import { Alert } from "@mui/material";

import { getProductById } from "@/app/api/products/[id]/actions";
import OpenBillingPortal from "@/components/BillingPortal/Open";
import pages from "pages";


export default async function SubscriptionPlanCurrent({
  customerId,
  subscriptions,
}: {
  customerId: string | undefined,
  subscriptions: Stripe.Subscription[],
}) {
  const subscribedProduct = subscriptions.length ? await getProductById(subscriptions[0].items.data[0].price.product as string) : null;

  if (!customerId) return null;

  return (
    <Alert
      severity="info"
      variant="outlined"
      action={
        <OpenBillingPortal
          returnUrl={pages.plans}
          variant="contained"
        >
          Manage Subscription
        </OpenBillingPortal>
      }
    >
      You are currently subscribed to {subscribedProduct?.name}
    </Alert>
  );
}