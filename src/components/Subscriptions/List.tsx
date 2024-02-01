import Link from "next/link";
import { UseQueryResult } from "react-query";
import Stripe from "stripe";

import AddIcon from "@mui/icons-material/AddRounded";
import { Button, List, ListItem, ListProps, Stack } from "@mui/material";

import SubscriptionsListItem from "./ListItem";
import ListSkeleton from "@/components/ui/ListSkeleton";
import ViewError from "@/components/ui/ViewError";
import useLoadMore from "@/hooks/useLoadMore";


export type SubscriptionsListProps = ListProps & {
  query: UseQueryResult<Stripe.Subscription[]>,
  visible?: number,
};

export default function SubscriptionsList({
  query,
  visible,
  ...props
}: SubscriptionsListProps) {
  const { incrementButtonProps, ...loadMore } = useLoadMore(query.data || [], visible);

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
              variant="text"
              size="medium"
              component={Link}
              href="/plans"
              startIcon={<AddIcon />}
            >
              Subscribe now
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
        <Button
          fullWidth
          sx={{ fontSize: "caption.fontSize" }}
          {...incrementButtonProps}
        />
      </ListItem>
    </List>
  );
}