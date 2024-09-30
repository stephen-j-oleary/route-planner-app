"use client";

import Stripe from "stripe";

import { Button, Table, TableBody, TableCell, TableProps, TableRow } from "@mui/material";

import InvoicesListItem from "../ListItem";
import ViewError from "@/components/ui/ViewError";
import useLoadMore from "@/hooks/useLoadMore";
import { StripePriceActiveExpandedProduct } from "@/models/Price";


export type InvoicesListProps = TableProps & {
  invoices: (Stripe.Invoice | Stripe.UpcomingInvoice)[],
  prices: StripePriceActiveExpandedProduct[],
  visible?: number,
};

export default function InvoicesList({
  invoices,
  prices,
  visible,
  ...props
}: InvoicesListProps) {
  const { incrementButtonProps, ...loadMore } = useLoadMore(invoices, visible);

  if (!invoices.length) return <ViewError primary="No invoices found" secondary="We didn't find any invoices for your account" />;

  return (
    <Table size="small" {...props}>
      <TableBody>
        {
          loadMore.visible.map((item, i) => (
            <InvoicesListItem
              key={"id" in item ? item.id : i}
              item={item}
              prices={prices}
            />
          ))
        }

        <TableRow>
          <TableCell
            colSpan={InvoicesListItem.cols}
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