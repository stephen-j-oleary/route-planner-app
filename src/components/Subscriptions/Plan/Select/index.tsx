"use client";

import { groupBy } from "lodash-es";
import Link from "next/link";
import { Fragment, useState } from "react";
import Stripe from "stripe";

import { ArrowForwardRounded } from "@mui/icons-material";
import { Box, BoxProps, Button, Card, CardActions, CardContent, CardHeader, Divider, Stack, Typography } from "@mui/material";

import OpenBillingPortal from "@/components/BillingPortal/Open";
import SubscriptionPlanSelectPrice from "@/components/Subscriptions/Plan/Select/Price";
import { StripePriceActiveExpandedProduct } from "@/models/Price";
import pages from "@/pages";
import formatMoney from "@/utils/formatMoney";
import { appendQuery } from "@/utils/url";


const INTERVAL_MULTIPLIERS = {
  day: 1,
  week: 7,
  month: 30,
  year: 365,
};
const INTERVAL_NAMES = {
  day: "daily",
  week: "weekly",
  month: "monthly",
  year: "yearly",
};

const getIntervalMultiplier = (price: StripePriceActiveExpandedProduct) => (
  price.recurring ? INTERVAL_MULTIPLIERS[price.recurring.interval] * price.recurring.interval_count : 0
);

const sortPrices = (prices: StripePriceActiveExpandedProduct[]) => (
  prices.toSorted((a, b) => {
    if ((a.unit_amount ?? 0) !== (b.unit_amount ?? 0)) return (a.unit_amount ?? 0) - (b.unit_amount ?? 0);
    return getIntervalMultiplier(a) - getIntervalMultiplier(b);
  })
);

export type SubscriptionPlanSelectProps =
  & BoxProps
  & {
    hasSession: boolean,
    callbackUrl: string | undefined,
    prices: StripePriceActiveExpandedProduct[],
    subscriptions: Stripe.Subscription[],
    subscribedProduct: Stripe.Product | null,
  };

export default function SubscriptionPlanSelect({
  hasSession,
  callbackUrl,
  prices,
  subscriptions,
  subscribedProduct,
  ...props
}: SubscriptionPlanSelectProps) {
  const [selectedPrice, setSelectedPrice] = useState(subscriptions.length ? prices.find(price => subscriptions[0].items.data[0].price.id === price.id) : sortPrices(prices)[0]);

  return (
    <Stack width="100%" spacing={4}>
      <Box
        width="100%"
        display="grid"
        gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
        gridAutoFlow="row"
        gap={2}
        {...props}
      >
        {
          Object.entries(
            groupBy(
              prices,
              price => price.product.name,
            )
          )
            .map(([name, prices]) => (
              <Card key={name}>
                <CardHeader title={name} titleTypographyProps={{ fontWeight: 600 }} />

                <CardContent>
                  <Typography variant="body1" pb={2}>
                    {prices[0].product.description}
                  </Typography>

                  <Typography variant="body2" component="ul">
                    {
                      prices[0].product.marketing_features.map((feat, i) => (
                        <li key={i}>{feat.name}</li>
                      ))
                    }
                  </Typography>
                </CardContent>

                <CardActions>
                  <Stack spacing={2} width="100%">
                    {
                      sortPrices(prices).map((price, i, arr) => (
                        <Fragment key={price.id}>
                          <SubscriptionPlanSelectPrice
                            fullWidth
                            size="small"
                            price={price}
                            selected={selectedPrice === price}
                            onSelect={() => setSelectedPrice(price)}
                            disabled={!!subscriptions.length}
                          />

                          {
                            (i + 1 < arr.length && arr[i + 1].recurring) && (
                              <Typography variant="caption" textAlign="center">
                                or save with {INTERVAL_NAMES[arr[i + 1].recurring!.interval]} billing
                              </Typography>
                            )
                          }
                        </Fragment>
                      ))
                    }
                  </Stack>
                </CardActions>
              </Card>
            ))
        }
      </Box>

      <Divider sx={{ width: "100%" }} />

      <div>
        <Typography variant="body1">
          {
            subscriptions.length
              ? `Your subscription: ${subscribedProduct?.name ?? "Plan not found"}`
              : `Selected plan: ${selectedPrice?.product.name ?? "No plan selected"}`
          }
        </Typography>

        <Typography component="p" variant="h4" lineHeight={1.5}>
          {
            (!subscriptions.length && selectedPrice)
              && `$${formatMoney(selectedPrice.unit_amount, { trailingDecimals: 2 })} ${selectedPrice.currency.toUpperCase()} per ${selectedPrice.recurring?.interval}`
          }
        </Typography>
      </div>

      {
        subscriptions.length
          ? (
            <OpenBillingPortal
              returnUrl={callbackUrl}
              fullWidth
              variant="contained"
              size="large"
            >
              Manage Subscription
            </OpenBillingPortal>
          )
          : (
            <Button
              fullWidth
              variant="contained"
              size="large"
              endIcon={<ArrowForwardRounded />}
              component={Link}
              href={
                appendQuery(
                  !hasSession
                    ? pages.login
                    : selectedPrice
                    ? `${pages.subscribe}/${selectedPrice.lookup_key ?? selectedPrice.id}`
                    : pages.plans,
                  { callbackUrl, plan: (!hasSession && (selectedPrice?.lookup_key ?? selectedPrice?.id)) || undefined },
                )
              }
              disabled={!selectedPrice}
            >
              Continue {selectedPrice?.unit_amount === 0 ? "for free" : "to checkout"}
            </Button>
          )
      }
    </Stack>
  );
}