import moment from "moment";
import NextLink from "next/link";
import Stripe from "stripe";

import { Chip, Link, ListItem, ListItemProps, ListItemText, Skeleton } from "@mui/material";

import { SubscriptionActions } from "./Actions";
import { useGetProducts } from "@/shared/reactQuery/useProducts";
import formatMoney from "@/shared/utils/formatMoney";


export interface SubscriptionListItemProps extends ListItemProps {
  subscription: Stripe.Subscription,
}

export default function SubscriptionsListItem({
  subscription,
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
  const amount = items.data[0].price.unit_amount;
  const intervalCount = items.data[0].price.recurring.interval_count;
  const interval = items.data[0].price.recurring.interval;

  const product = useGetProducts({
    select: data => data.find(item => item.id === items.data[0].price.product),
  });
  const isCancelScheduled = !!(cancel_at_period_end || cancel_at);


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
              product.isLoading
                ? <Skeleton />
                : product.data?.name || description || "Subscription Item"
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
            color={isCancelScheduled ? "error" : "success"}
            label={
              `${isCancelScheduled ? "Ends" : "Renews"} on ${moment.unix(
                (!isCancelScheduled || cancel_at_period_end)
                  ? current_period_end
                  : cancel_at
              ).format("MMM Do, YYYY")}`
            }
          />
        }
      />
    </ListItem>
  );
}