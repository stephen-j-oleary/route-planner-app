import moment from "moment";
import NextLink from "next/link";
import Stripe from "stripe";

import { Chip, Link, ListItem, ListItemProps, ListItemText } from "@mui/material";

import { SubscriptionActions } from "./Actions";
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
    id,
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
    <ListItem
      secondaryAction={
        <SubscriptionActions subscription={subscription} />
      }
      {...props}
    >
      <ListItemText
        primary={
          <Link
            component={NextLink}
            href={`/account/subscriptions/${id}`}
            color="inherit"
            underline="none"
            sx={{
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {
              expandedProduct?.name || description || "Subscription Item"
            }
          </Link>
        }
        secondary={
          `$${formatMoney(amount)} / ${intervalCount !== 1 ? ` ${intervalCount}` : ""}${interval}${intervalCount !== 1 ? "s" : ""}`
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