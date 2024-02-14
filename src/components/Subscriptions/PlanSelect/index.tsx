import Link from "next/link";
import React, { useCallback, useMemo, useState } from "react";
import { DeepNonNullable } from "utility-types";

import { ArrowForwardRounded, CheckRounded } from "@mui/icons-material";
import { Box, Button, Card, CardActions, CardContent, Stack, StackProps, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";

import ListSkeleton from "@/components/ui/ListSkeleton";
import ViewError from "@/components/ui/ViewError";
import { StripePriceActiveExpandedProduct } from "@/models/Price";
import { useGetPrices } from "@/reactQuery/usePrices";
import { useGetUserSubscriptions } from "@/reactQuery/useSubscriptions";
import formatMoney from "@/utils/formatMoney";


const INTERVALS = ["month", "year"] as const;
const INTERVAL_NAMES = {
  month: "Billed monthly",
  year: "Billed yearly",
};
const YEARLY_DISCOUNT = 1 / 12;

export type SubscriptionPlanSelectProps = StackProps;

export default function SubscriptionPlanSelect(props: SubscriptionPlanSelectProps) {
  const [interval, setInterval] = useState<typeof INTERVALS[number]>(INTERVALS[0]);

  const subscriptions = useGetUserSubscriptions();
  const prices = useGetPrices<StripePriceActiveExpandedProduct[]>({
    params: {
      active: true,
      expand: ["data.product"],
    },
  });

  const hasSubscriptions = useMemo(
    () => !!subscriptions.data?.length,
    [subscriptions]
  );
  const isSubscribed = useCallback(
    (priceId: string) => subscriptions.data?.some(sub => sub.items.data.some(item => item.price.id === priceId)),
    [subscriptions]
  );


  if (prices.isLoading && !prices.data) return <ListSkeleton />;
  if (!prices.data) return <ViewError primary="Failed to load plans" />;

  return (
    <Stack spacing={4} alignItems="center" {...props}>
      <Stack spacing={1} alignItems="center">
        <ToggleButtonGroup
          size="small"
          exclusive
          value={interval}
          onChange={(_e, value) => {
            if (value !== null /* Disallow deselect */) setInterval(value);
          }}
        >
          {
            INTERVALS.map(item => {
              return (
                <ToggleButton
                  key={item}
                  value={item}
                >
                  {INTERVAL_NAMES[item]}
                </ToggleButton>
              )
            })
          }
        </ToggleButtonGroup>

        <Typography variant="caption">
          {`Save ${(YEARLY_DISCOUNT * 100).toFixed(0)}% with yearly billing`}
        </Typography>
      </Stack>

      <Box
        width="100%"
        display="grid"
        gridAutoColumns="1fr"
        gridAutoFlow="column"
        gap={2}
        {...props}
      >
        {
          prices.data
            .filter((price): price is Omit<typeof price, "recurring"> & DeepNonNullable<Pick<typeof price, "recurring">> => price.recurring?.interval === interval)
            .map(price => (
              <Card key={price.id}>
                <CardContent>
                  <Typography
                    component="p"
                    variant="h5"
                    mb={3}
                  >
                    {price.product.name}
                  </Typography>

                  <Stack
                    direction="row"
                    alignItems="center"
                  >
                    <Typography
                      component="span"
                      variant="h2"
                      sx={{ flex: "0 0 auto" }}
                    >
                      ${formatMoney(price.unit_amount, { trailingDecimals: 0 })} {price.currency.toUpperCase()}
                    </Typography>

                    <Typography
                      component="span"
                      variant="subtitle1"
                      color="text.secondary"
                      lineHeight={1}
                      ml={1}
                      sx={{ wordSpacing: "100vw" }} /* Break between words */
                    >
                      per {price.recurring.interval}
                    </Typography>
                  </Stack>
                </CardContent>

                <CardActions>
                  <Button
                    fullWidth
                    size="large"
                    variant="contained"
                    component={Link}
                    href={
                      price.lookup_key
                        ? `/subscribe/${price.lookup_key}`
                        : `/subscribe/id/${price.id}`
                    }
                    sx={{ marginInline: "auto" }}
                    endIcon={
                      isSubscribed(price.id)
                        ? <CheckRounded />
                        : <ArrowForwardRounded />
                    }
                    disabled={
                      subscriptions.isIdle
                      || subscriptions.isLoading
                      || !price.id
                      || isSubscribed(price.id)
                    }
                  >
                    {
                      isSubscribed(price.id)
                        ? "Subscribed"
                        : hasSubscriptions
                        ? "Change subscription"
                        : "Subscribe now"
                    }
                  </Button>
                </CardActions>

                <CardContent>
                  <Typography variant="body2" component="ul">
                    <li>Remove ads</li>
                    <li>Calculate routes up to 100 stops</li>
                    <li>Save routes for later</li>
                  </Typography>
                </CardContent>
              </Card>
            ))
        }
      </Box>
    </Stack>
  );
}