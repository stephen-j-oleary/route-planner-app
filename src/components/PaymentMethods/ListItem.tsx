import Stripe from "stripe";

import { ListItem, ListItemProps, ListItemText, Typography } from "@mui/material";

import { PaymentMethodActions } from "./Actions";


export type PaymentMethodsListItemProps = ListItemProps & {
  paymentMethod: Stripe.PaymentMethod,
}

export default function PaymentMethodsListItem({
  paymentMethod,
  ...props
}: PaymentMethodsListItemProps) {
  const { card } = paymentMethod;
  if (!card) return <></>;


  return (
    <ListItem
      divider
      secondaryAction={
        <PaymentMethodActions paymentMethod={paymentMethod} />
      }
      {...props}
    >
      <ListItemText
        primary={
          <>
            <Typography
              component="span"
              sx={{ textTransform: "capitalize" }}
            >
              {card.brand}
            </Typography>
            <Typography
              component="span"
              paddingLeft={.5}
            >
              **** {card.last4}
            </Typography>
          </>
        }
        secondary={`Expires ${card.exp_month}/${card.exp_year}`}
      />
    </ListItem>
  );
}