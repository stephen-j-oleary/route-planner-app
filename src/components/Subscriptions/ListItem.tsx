import moment from "moment";
import pluralize from "pluralize";
import Stripe from "stripe";

import { Chip, ListItem, ListItemProps, ListItemText } from "@mui/material";

import { StripePriceActiveExpandedProduct } from "@/models/Price";
import formatMoney from "@/utils/formatMoney";


export interface SubscriptionListItemProps extends ListItemProps {
  subscription: Stripe.Subscription,
  prices: StripePriceActiveExpandedProduct[],
}

export default function SubscriptionsListItem({
  subscription,
  prices,
  ...props
}: SubscriptionListItemProps) {
  const {
    description,
    items,
    current_period_end,
    cancel_at_period_end,
    cancel_at,
  } = subscription;
  const amount = items.data[0]?.price.unit_amount;
  const intervalCount = items.data[0]?.price.recurring?.interval_count;
  const interval = items.data[0]?.price.recurring?.interval;
  const cancelScheduled = cancel_at_period_end ? current_period_end : cancel_at;

  const product = items.data[0]?.price.product;
  const productId = typeof product !== "string"
    ? product?.id
    : product;
  const expandedProduct = productId ? prices.find(item => item.product.id === productId)?.product : null;



  return (
    <ListItem {...props}>
      <ListItemText
        primary={
          expandedProduct?.name || description || "Subscription Item"
        }
        secondary={
          `$${formatMoney(amount)}${interval ? ` / ${intervalCount !== 1 ? ` ${intervalCount}` : ""}${pluralize(interval, intervalCount)}` : ""}`
        }
      />

      <ListItemText
        primary={
          <Chip
            size="small"
            variant="outlined"
            color={cancelScheduled ? "error" : "success"}
            label={
              `${cancelScheduled ? "Ends" : "Renews"} on ${moment.unix(
                cancelScheduled || current_period_end
              ).format("MMM Do, YYYY")}`
            }
          />
        }
      />
    </ListItem>
  );
}