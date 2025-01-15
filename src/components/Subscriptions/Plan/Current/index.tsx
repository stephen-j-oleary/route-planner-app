import Link from "next/link";
import Stripe from "stripe";

import { Alert, Button } from "@mui/material";

import { getProductById } from "@/app/api/products/[id]/actions";
import { postUserBillingPortal } from "@/app/api/user/billingPortal/actions";
import pages from "pages";


export default async function SubscriptionPlanCurrent({
  customerId,
  subscriptions,
}: {
  customerId: string | undefined,
  subscriptions: Stripe.Subscription[],
}) {
  const subscribedProduct = subscriptions.length ? await getProductById(subscriptions[0].items.data[0].price.product as string) : null;
  const billingPortal = (customerId && subscriptions.length) ? await postUserBillingPortal({ customer: customerId!, return_url: pages.plans }) : null;

  if (!billingPortal) return null;

  return (
    <Alert
      severity="info"
      variant="outlined"
      action={
        <Button
          variant="contained"
          component={Link}
          href={billingPortal.url}
        >
          Manage Subscription
        </Button>
      }
    >
      You are currently subscribed to {subscribedProduct?.name}
    </Alert>
  );
}