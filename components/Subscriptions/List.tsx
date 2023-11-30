import Link from "next/link";
import Stripe from "stripe";

import AddIcon from "@mui/icons-material/AddRounded";
import { Button, List, ListItem, ListProps, Stack } from "@mui/material";

import SubscriptionsListItem from "./ListItem";
import ListSkeleton from "@/components/ListSkeleton";
import ViewError from "@/components/ViewError";
import useLoadMore from "@/shared/hooks/useLoadMore";


export type SubscriptionsListProps = ListProps & {
  query: {
    isLoading: boolean,
    isError: boolean,
    isIdle: boolean,
    data: Stripe.Subscription[],
  },
  visible?: number,
};

export default function SubscriptionsList({
  query,
  visible,
  ...props
}: SubscriptionsListProps) {
  const { IncrementButton, ...loadMore } = useLoadMore(query.data || [], visible);

  if (query.isLoading && !query.data) return <ListSkeleton disablePadding rowProps={{ divider: true }} />;
  if (query.isError) return <ViewError secondary="Subscriptions could not be loaded" />;
  if (query.isIdle || !query.data?.length) {
    return (
      <ViewError
        primary="No subscriptions found"
        secondary="Looks like you haven't signed up for a plan yet"
        action={
          <Stack alignItems="center">
            <Button
              variant="contained"
              size="medium"
              component={Link}
              href="/account/subscriptions/manage"
              startIcon={<AddIcon />}
            >
              Add a subscription now
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
            divider
          />
        ))
      }

      <ListItem dense disablePadding>
        <IncrementButton
          fullWidth
          sx={{ fontSize: "caption.fontSize" }}
        />
      </ListItem>
    </List>
  );
}