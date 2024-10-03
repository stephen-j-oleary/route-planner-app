"use client";

import Stripe from "stripe";

import { Button, Table, TableBody, TableCell, TableHead, TableProps, TableRow } from "@mui/material";

import SubscriptionItemsListItem from "./ListItem";
import ViewError from "@/components/ui/ViewError";
import useLoadMore from "@/hooks/useLoadMore";
import { StripePriceActiveExpandedProduct } from "@/models/Price";


export type SubscriptionItemsListProps = TableProps & {
  subscriptionItems: Stripe.SubscriptionItem[],
  prices: StripePriceActiveExpandedProduct[],
  visible?: number,
};

export default function SubscriptionItemsList({
  subscriptionItems,
  prices,
  visible,
  ...props
}: SubscriptionItemsListProps) {
  const { incrementButtonProps, ...loadMore } = useLoadMore(subscriptionItems, visible);

  if (subscriptionItems.length === 0) {
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
              prices={prices}
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
            <Button
              fullWidth
              sx={{ fontSize: "caption.fontSize" }}
              {...incrementButtonProps}
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}