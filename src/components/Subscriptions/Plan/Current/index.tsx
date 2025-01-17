import Stripe from "stripe";

import { Alert } from "@mui/material";

import OpenBillingPortal from "@/components/BillingPortal/Open";
import pages from "pages";


export default function SubscriptionPlanCurrent({
  subscriptions,
  subscribedProduct,
}: {
  subscriptions: Stripe.Subscription[],
  subscribedProduct: Stripe.Product | null,
}) {
  if (!subscriptions.length) return null;

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