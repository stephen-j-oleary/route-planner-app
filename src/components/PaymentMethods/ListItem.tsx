import Stripe from "stripe";

import { ListItem, ListItemProps, ListItemText } from "@mui/material";


export type PaymentMethodsListItemProps = ListItemProps & {
  paymentMethod: Stripe.PaymentMethod,
}

export default function PaymentMethodsListItem({
  paymentMethod,
  ...props
}: PaymentMethodsListItemProps) {
  const { card } = paymentMethod;
  if (!card) return null;


  return (
    <ListItem {...props}>
      <ListItemText
        primary={`${card.brand} **** ${card.last4}`}
        primaryTypographyProps={{ textTransform: "capitalize" }}
        secondary={`Expires ${card.exp_month}/${card.exp_year}`}
      />
    </ListItem>
  );
}