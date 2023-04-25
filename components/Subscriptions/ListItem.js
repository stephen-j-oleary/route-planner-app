import moment from "moment";
import NextLink from "next/link";

import { Chip, Link, ListItem, ListItemText, Skeleton } from "@mui/material";

import { SubscriptionActions } from "./Actions";
import { useGetProducts } from "@/shared/reactQuery/useProducts";


export default function SubscriptionsListItem({ subscription, ...props }) {
  const product = useGetProducts({
    select: data => data.find(item => item.id === subscription.items.data[0].price.product),
  });
  const isCancelScheduled = !!(subscription.cancel_at_period_end || subscription.cancel_at);


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
            href={`/profile/subscriptions/${subscription.id}`}
            color="inherit"
            underline="none"
            sx={{
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {
              product.isSuccess
                ? product.data?.name || subscription.description || "Subscription Item"
                : <Skeleton />
            }
          </Link>

        }
        secondary={
          !isCancelScheduled && (
            `Renews on ${
              moment.unix(
                subscription.current_period_end
              ).format("MMM Do, YYYY")
            }`
          )
        }
      />

      {
        isCancelScheduled && (
          <ListItemText
            primary={
              <Chip
                label={
                  `Ends on ${moment.unix(
                    subscription.cancel_at_period_end
                      ? subscription.current_period_end
                      : subscription.cancel_at
                  ).format("MMM Do, YYYY")}`
                }
              />
            }
          />
        )
      }
    </ListItem>
  );
}