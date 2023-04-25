import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

import SubscriptionItemsListItem from "./ListItem";
import TableSkeleton from "@/components/TableSkeleton";
import ViewError from "@/components/ViewError";
import useLoadMore from "@/shared/hooks/useLoadMore";


export default function SubscriptionItemsList({ loading, error, data, visible, ...props }) {
  const { IncrementButton, ...loadMore } = useLoadMore(data, visible);

  if (loading) {
    return (
      <TableSkeleton
        {...props}
        cols={3}
      />
    );
  }

  if (error) {
    return (
      <ViewError
        primary="Subscription items could not be loaded"
        secondary="An error occurred"
      />
    );
  }

  if (data.length === 0) {
    return (
      <ViewError
        primary="No subscription items found"
      />
    );
  }

  return (
    <Table {...props}>
      <TableHead>
        <TableRow>
          <TableCell>Product</TableCell>
          <TableCell>Quantity</TableCell>
          <TableCell>Total</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {
          loadMore.visible.map(item => (
            <SubscriptionItemsListItem
              key={item.id}
              item={item}
            />
          ))
        }

        <TableRow>
          <TableCell
            colSpan={3}
            size="small"
            padding="none"
            sx={{ border: "none" }}
          >
            <IncrementButton
              fullWidth
              sx={{ fontSize: "caption.fontSize" }}
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}