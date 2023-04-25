import Link from "next/link";

import AddIcon from "@mui/icons-material/AddRounded";
import { Button, List, ListItem } from "@mui/material";

import SubscriptionsListItem from "./ListItem";
import ListSkeleton from "@/components/ListSkeleton";
import ViewError from "@/components/ViewError";
import useLoadMore from "@/shared/hooks/useLoadMore";


export default function SubscriptionsList({ loading, error, data, visible, ...props }) {
  const { IncrementButton, ...loadMore } = useLoadMore(data, visible);

  if (loading) {
    return (
      <ListSkeleton
        disablePadding
        rowProps={{ divider: true }}
      />
    );
  }

  if (error) {
    return (
      <ViewError
        primary="Subscriptions could not be loaded"
        secondary="An error occurred"
      />
    );
  }

  if (data.length === 0) {
    return (
      <ViewError
        primary="No subscriptions found"
        secondary="Looks like you haven't signed up for a plan yet"
        action={
          <Button
            fullWidth
            size="size"
            component={Link}
            href="/profile/subscriptions/manage"
            startIcon={<AddIcon />}
          >
            Add a subscription now
          </Button>
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