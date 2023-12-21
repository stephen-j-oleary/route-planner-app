import Stripe from "stripe";

import { Table, TableBody, TableCell, TableHead, TableProps, TableRow } from "@mui/material";

import SubscriptionItemsListItem from "./ListItem";
import TableSkeleton from "@/components/ui/TableSkeleton";
import ViewError from "@/components/ui/ViewError";
import useLoadMore from "@/hooks/useLoadMore";


export type SubscriptionItemsListProps = TableProps & {
  query: {
    isIdle: boolean,
    isLoading: boolean,
    isError: boolean,
    error?: unknown,
    data?: Stripe.SubscriptionItem[] | null,
  },
  visible?: number,
};

export default function SubscriptionItemsList({
  query,
  visible,
  ...props
}: SubscriptionItemsListProps) {
  const { IncrementButton, ...loadMore } = useLoadMore(query.data, visible);

  if (query.isIdle || (query.isLoading && !query.data)) {
    return (
      <TableSkeleton
        {...props}
        cols={3}
      />
    );
  }

  if (query.error instanceof Error) {
    return (
      <ViewError
        primary="Subscription items could not be loaded"
        secondary="An error occurred"
      />
    );
  }

  if (query.data.length === 0) {
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