import { Button, List, ListItem } from "@mui/material";

import PaymentMethodsListItem from "../ListItem";
import ListSkeleton from "@/components/ui/ListSkeleton";
import ViewError from "@/components/ui/ViewError";
import useLoadMore from "@/hooks/useLoadMore";


export default function PaymentMethodsList({ loading, error, data, visible, ...props }) {
  const { incrementButtonProps, ...loadMore } = useLoadMore(data, visible);

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
        primary="Payment methods could not be loaded"
        secondary="An error occurred"
      />
    );
  }

  if (data.length === 0) {
    return (
      <ViewError
        primary="No payment methods found"
        secondary="Looks like you haven't added a payment method yet"
      />
    );
  }

  return (
    <List disablePadding {...props}>
      {
        loadMore.visible.map(item => (
          <PaymentMethodsListItem
            key={item.id}
            item={item}
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