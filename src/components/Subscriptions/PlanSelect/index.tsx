"use client";

import { groupBy } from "lodash-es";
import Link from "next/link";
import Stripe from "stripe";

import { ArrowForwardRounded, CheckRounded } from "@mui/icons-material";
import { Box, Button, Card, CardActions, CardContent, CardHeader, Stack, StackProps, Tooltip, Typography } from "@mui/material";

import { StripePriceActiveExpandedProduct } from "@/models/Price";
import formatMoney from "@/utils/formatMoney";


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

export type SubscriptionPlanSelectProps =
  & StackProps
  & {
    activeSubscriptions: Stripe.Subscription[],
    activePrices: StripePriceActiveExpandedProduct[],
  };

export default function SubscriptionPlanSelect({
  activeSubscriptions,
  activePrices,
  ...props
}: SubscriptionPlanSelectProps) {
  return (
    <Stack spacing={4} alignItems="center" {...props}>
      <Box
        width="100%"
        display="grid"
        gridAutoColumns="1fr"
        gridAutoFlow="column"
        gap={2}
        {...props}
      >
        {
          Object.entries(
            groupBy(
              activePrices,
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
                      prices[0].product.features.map((feat, i) => (
                        <li key={i}>{feat.name}</li>
                      ))
                    }
                  </Typography>
                </CardContent>

                <CardActions>
                  <Stack spacing={2} width="100%">
                    {
                      prices
                        .map(price => ({ ...price, interval_multiplier: price.recurring ? INTERVAL_MULTIPLIERS[price.recurring.interval] * price.recurring.interval_count : 0 }))
                        .toSorted((a, b) => a.interval_multiplier - b.interval_multiplier)
                        .map((price, i, arr) => {
                          const isSubscribed = activeSubscriptions.some(sub => sub.items.data.some(item => item.price.id === price.id));

                          return (
                            <>
                              <Tooltip key={price.id} title={isSubscribed ? "Already Subscribed" : false}>
                                <span>
                                  <Button
                                    fullWidth
                                    size="large"
                                    variant="contained"
                                    component={price.id !== "free" ? Link : "button"}
                                    href={
                                      price.lookup_key
                                        ? `/subscribe/${price.lookup_key}`
                                        : `/subscribe/id/${price.id}`
                                    }
                                    sx={{ marginInline: "auto" }}
                                    endIcon={
                                      isSubscribed
                                        ? <CheckRounded />
                                        : <ArrowForwardRounded />
                                    }
                                    disabled={isSubscribed}
                                  >
                                    {
                                      price.unit_amount === 0
                                        ? "Free"
                                        : `$${formatMoney(price.unit_amount, { trailingDecimals: 0 })} ${price.currency.toUpperCase()} per ${price.recurring?.interval}`
                                    }
                                  </Button>
                                </span>
                              </Tooltip>

                              {
                                (i + 1 < arr.length && arr[i + 1].recurring) && (
                                  <Typography variant="caption" textAlign="center">
                                    or save with {INTERVAL_NAMES[arr[i + 1].recurring!.interval]} billing
                                  </Typography>
                                )
                              }
                            </>
                          );
                        })
                    }
                  </Stack>
                </CardActions>
              </Card>
            ))
        }
      </Box>
    </Stack>
  );
}