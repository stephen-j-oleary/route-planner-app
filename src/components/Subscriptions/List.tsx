"use client";

import Link from "next/link";
import Stripe from "stripe";

import AddIcon from "@mui/icons-material/AddRounded";
import { Button, List, ListItem, ListProps, Stack } from "@mui/material";

import SubscriptionsListItem from "./ListItem";
import ViewError from "@/components/ui/ViewError";
import useLoadMore from "@/hooks/useLoadMore";
import { StripePriceActiveExpandedProduct } from "@/models/Price";


export type SubscriptionsListProps = ListProps & {
  subscriptions: Stripe.Subscription[],
  prices: StripePriceActiveExpandedProduct[],
  visible?: number,
};

export default function SubscriptionsList({
  subscriptions,
  prices,
  visible,
  ...props
}: SubscriptionsListProps) {
  const { incrementButtonProps, ...loadMore } = useLoadMore(subscriptions || [], visible);

  if (!subscriptions?.length) {
    return (
      <ViewError
        primary="No subscriptions found"
        secondary="Looks like you haven't signed up for a plan yet"
        action={
          <Stack alignItems="center">
            <Button
              variant="text"
              size="medium"
              component={Link}
              href="/plans"
              startIcon={<AddIcon />}
            >
              Subscribe now
            </Button>
          </Stack>
        }
      />
    );
  }

  return (
    <List disablePadding {...props}>
      {
        loadMore.visible.map(item => (
          <SubscriptionsListItem
            key={item.id}
            subscription={item}
            prices={prices}
            divider
          />
        ))
      }

      <ListItem dense disablePadding>
        <Button
          fullWidth
          sx={{ fontSize: "caption.fontSize" }}
          {...incrementButtonProps}
        />
      </ListItem>
    </List>
  );
}