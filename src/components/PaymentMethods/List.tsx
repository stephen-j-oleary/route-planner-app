"use client";

import Link from "next/link";
import Stripe from "stripe";

import { AddRounded } from "@mui/icons-material";
import { Button, List, ListItem, ListProps, Stack } from "@mui/material";

import PaymentMethodsListItem from "./ListItem";
import ViewError from "@/components/ui/ViewError";
import useLoadMore from "@/hooks/useLoadMore";


export type PaymentMethodsListProps = ListProps & {
  paymentMethods: Stripe.PaymentMethod[],
  visible?: number,
}

export default function PaymentMethodsList({
  paymentMethods,
  visible,
  ...props
}: PaymentMethodsListProps) {
  const { incrementButtonProps, ...loadMore } = useLoadMore(paymentMethods || [], visible);

  if (!paymentMethods.length) {
    return (
      <ViewError
        primary="No payment methods found"
        secondary="Looks like you haven't added a payment method yet"
        action={
          <Stack alignItems="center">
            <Button
              variant="text"
              size="medium"
              component={Link}
              href="/account/paymentMethods/setup"
              startIcon={<AddRounded />}
            >
              Add a payment method
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
          <PaymentMethodsListItem
            key={item.id}
            paymentMethod={item}
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

      <ListItem>
        <Button
          variant="text"
          size="medium"
          component={Link}
          href="/account/paymentMethods/setup"
          startIcon={<AddRounded />}
        >
          Add a payment method
        </Button>
      </ListItem>
    </List>
  );
}