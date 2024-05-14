import Stripe from "stripe";

import { Button, Table, TableBody, TableCell, TableProps, TableRow } from "@mui/material";

import InvoicesListItem from "../ListItem";
import TableSkeleton from "@/components/ui/TableSkeleton";
import ViewError from "@/components/ui/ViewError";
import useLoadMore from "@/hooks/useLoadMore";


export type InvoicesListProps = TableProps & {
  query: {
    isIdle?: boolean,
    isLoading?: boolean,
    error?: Error,
    data: (Stripe.Invoice | Stripe.UpcomingInvoice)[] | undefined,
  },
  visible?: number,
};

export default function InvoicesList({
  query,
  visible,
  ...props
}: InvoicesListProps) {
  const { incrementButtonProps, ...loadMore } = useLoadMore(query.data, visible);

  if (query.isIdle || (query.isLoading && !query.data)) return <TableSkeleton size="small" cols={InvoicesListItem.cols} />;
  if (query.error instanceof Error) return <ViewError secondary="Invoices could not be loaded" />;
  if (!query.data?.length) return <ViewError primary="No invoices found" secondary="We didn't find any invoices for your account" />;

  return (
    <Table size="small" {...props}>
      <TableBody>
        {
          loadMore.visible.map((item, i) => (
            <InvoicesListItem
              key={"id" in item ? item.id : i}
              item={item}
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