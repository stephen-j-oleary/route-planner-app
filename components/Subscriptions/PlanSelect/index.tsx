import Link from "next/link";
import React, { useCallback, useMemo, useState } from "react";

import { ArrowForwardRounded, CheckRounded } from "@mui/icons-material";
import { Box, Button, Card, CardActions, CardContent, Stack, StackProps, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";

import ListSkeleton from "@/components/ListSkeleton";
import ViewError from "@/components/ViewError";
import { StripePriceActiveExpandedProduct } from "@/shared/models/Price";
import { useGetPrices } from "@/shared/reactQuery/usePrices";
import { useGetSubscriptions } from "@/shared/reactQuery/useSubscriptions";
import formatMoney from "@/shared/utils/formatMoney";


const INTERVALS = ["month", "year"] as const;
const INTERVAL_NAMES = {
  month: "Billed monthly",
  year: "Billed yearly",
};

export type SubscriptionPlanSelectProps = StackProps;

export default function SubscriptionPlanSelect(props: SubscriptionPlanSelectProps) {
  const [interval, setInterval] = useState<typeof INTERVALS[number]>(INTERVALS[0]);

  const subscriptions = useGetSubscriptions();
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


  if ((prices.isLoading && !prices.data) || (subscriptions.isLoading && !subscriptions.data)) return <ListSkeleton />;
  if (!prices.data) return <ViewError primary="Failed to load subscriptions" />;

  return (
    <Stack spacing={4} alignItems="center" {...props}>
      <ToggleButtonGroup
        size="small"
        exclusive
        value={interval}
        onChange={(_e, value) => {
          if (value !== null /* Disallow deselect */) setInterval(value);
        }}
      >
        {
          INTERVALS.map(item => (
            <ToggleButton
              key={item}
              value={item}
            >
              {INTERVAL_NAMES[item]}
            </ToggleButton>
          ))
        }
      </ToggleButtonGroup>

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
            .filter(price => price.recurring.interval === interval)
            .map(price => (
              <Card key={price.id}>
                <CardContent>
                  <Typography
                    component="p"
                    variant="subtitle1"
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
                      variant="h4"
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
                    disabled={!price.id || isSubscribed(price.id)}
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
              </Card>
            ))
        }
      </Box>
    </Stack>
  );
}