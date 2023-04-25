import { ListItem, ListItemSecondaryAction, ListItemText, Typography } from "@mui/material";

import { PaymentMethodActions } from "../Actions";


export default function PaymentMethodsListItem({ item, ...props }) {
  if (item.type !== "card") return;

  return (
    <ListItem
      divider
      {...props}
    >
      <ListItemText
        primary={
          <>
            <Typography
              component="span"
              sx={{ textTransform: "capitalize" }}
            >
              {item.card.brand}
            </Typography>
            <Typography
              component="span"
              paddingLeft={.5}
            >
              **** {item.card.last4}
            </Typography>
          </>
        }
        secondary={`Expires ${item.card.exp_month}/${item.card.exp_year}`}
      />

      <ListItemSecondaryAction>
        <PaymentMethodActions paymentMethod={item} />
      </ListItemSecondaryAction>
    </ListItem>
  );
}