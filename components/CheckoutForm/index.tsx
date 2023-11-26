import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";

import { ArrowForwardRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Paper, Stack, Typography } from "@mui/material";

import InvoiceDetail from "@/components/Invoices/Detail";
import ListSkeleton from "@/components/ListSkeleton";
import { StripePriceActiveExpandedProduct } from "@/shared/models/Price";
import { useCreateCheckoutSession } from "@/shared/reactQuery/useCheckoutSession";
import { useCreateUpcomingInvoice } from "@/shared/reactQuery/useInvoices";
import { useGetPriceById } from "@/shared/reactQuery/usePrices";
import { useGetSubscriptions, useUpdateSubscriptionById } from "@/shared/reactQuery/useSubscriptions";
import formatMoney from "@/shared/utils/formatMoney";
import { stripeAppClient } from "@/shared/utils/stripeClient";


export type CheckoutFormProps = {
  priceId: string,
};

export default function CheckoutForm({
  priceId,
}: CheckoutFormProps) {
  const router = useRouter();

  const price = useGetPriceById(priceId, {
    params: { expand: ["product"] },
    select: data => data.active ? data as StripePriceActiveExpandedProduct : undefined,
  });
  const subscriptions = useGetSubscriptions();
  const createCheckoutSessionMutation = useCreateCheckoutSession();
  const createUpcomingInvoiceMutation = useCreateUpcomingInvoice();
  const updateSubscriptionMutation = useUpdateSubscriptionById();

  const clientSecret = useQuery({
    queryKey: ["checkoutSession", priceId],
    queryFn: async () => createCheckoutSessionMutation.mutateAsync({
      ui_mode: "embedded",
      mode: "subscription",
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      return_url: "/account/subscriptions",
    }),
    select: data => data.client_secret,
    refetchOnWindowFocus: false,
  });

  const newSubscriptionItems = [{
    id: subscriptions.data?.[0]?.items.data[0]?.id || undefined,
    price: priceId,
    quantity: 1,
  }];

  const changePreview = useQuery({
    queryKey: ["subscriptionChange", priceId],
    queryFn: async () => createUpcomingInvoiceMutation.mutateAsync({
      subscription: subscriptions.data?.[0]?.id,
      subscription_items: newSubscriptionItems,
      subscription_proration_date: Math.floor(Date.now() / 1000),
    }),
    enabled: !!subscriptions.data?.[0]?.id,
    refetchOnWindowFocus: false,
  });

  const handleUpdateSubscription = () => updateSubscriptionMutation.mutate({
    id: subscriptions.data?.[0]?.id,
    items: newSubscriptionItems,
  }, {
    onSuccess: () => void router.push("/account/subscriptions"),
  });


  if (subscriptions.isLoading) return <CheckoutFormSkeleton />;

  if (subscriptions.data?.length) {
    return (
      <Stack
        spacing={3}
        alignItems="center"
        component={Paper}
        padding={2}
      >
        <Stack spacing={1} alignItems="center">
          <Typography variant="h6">
            Change subscription to {price.data?.product.name}
          </Typography>

          <Stack
            direction="row"
            alignItems="flex-end"
            justifyContent="center"
          >
            <Typography
              component="span"
              variant="h4"
              sx={{ flex: "0 0 auto" }}
            >
              ${formatMoney(price.data?.unit_amount, { trailingDecimals: 0 })} {price.data?.currency.toUpperCase()}
            </Typography>

            <Typography
              component="span"
              variant="subtitle1"
              color="text.secondary"
              ml={1}
            >
              per {price.data?.recurring.interval}
            </Typography>
          </Stack>

          <Typography variant="body2">
            Here is an overview of the changes to your subscription
          </Typography>
        </Stack>

        <InvoiceDetail
          query={changePreview}
          excludeQuantity
          excludeUnitPrice
        />

        <LoadingButton
          size="large"
          variant="contained"
          endIcon={<ArrowForwardRounded />}
          loadingPosition="end"
          loading={updateSubscriptionMutation.isLoading}
          onClick={handleUpdateSubscription}
        >
          Subscribe
        </LoadingButton>
      </Stack>
    );
  }

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

const CheckoutFormSkeleton = () => (
  <Paper>
    <ListSkeleton />
  </Paper>
);