"use client";

import Stripe from "stripe";

import { Button, List, ListItem, ListItemText, ListProps } from "@mui/material";

import PaymentMethodsListItem from "./ListItem";
import ViewError from "@/components/ui/ViewError";
import useLoadMore from "@/hooks/useLoadMore";
import formatMoney from "@/utils/formatMoney";


export type PaymentMethodsListProps = ListProps & {
  customer: Stripe.Customer | Stripe.DeletedCustomer | null,
  paymentMethods: Stripe.PaymentMethod[],
  visible?: number,
}

export default function PaymentMethodsList({
  customer,
  paymentMethods,
  visible,
  ...props
}: PaymentMethodsListProps) {
  const { balance = 0 } = (
    customer?.deleted
      ? { balance: 0 }
      : customer
  ) || {};

  const { incrementButtonProps, ...loadMore } = useLoadMore(paymentMethods || [], visible);

  if (!paymentMethods.length) {
    return (
      <ViewError
        primary="No payment methods found"
        secondary="Looks like you haven't added a payment method yet"
      />
    );
  }

  return (
    <List disablePadding {...props}>
      <ListItem divider dense>
        <ListItemText
          primary="Customer balance"
          secondary={`$${formatMoney(-balance, { trailingDecimals: 2 })}`}
        />
      </ListItem>

      {
        loadMore.visible.map(item => (
          <PaymentMethodsListItem
            key={item.id}
            paymentMethod={item}
            divider
            dense
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