import { UseQueryResult } from "react-query";
import Stripe from "stripe";

import { Button, Table, TableBody, TableCell, TableProps, TableRow } from "@mui/material";

import InvoicesListItem from "../ListItem";
import TableSkeleton from "@/components/ui/TableSkeleton";
import ViewError from "@/components/ui/ViewError";
import useLoadMore from "@/hooks/useLoadMore";


export type InvoicesListProps = TableProps & {
  query: UseQueryResult<(Stripe.Invoice | Stripe.UpcomingInvoice)[]>,
  visible?: number,
};

export default function InvoicesList({
  query,
  visible,
  ...props
}: InvoicesListProps) {
  const { incrementButtonProps, ...loadMore } = useLoadMore(query.data, visible);

  if (query.isIdle || (query.isLoading && !query.data)) return <TableSkeleton size="small" cols={InvoicesListItem.cols} />;
  if (query.error instanceof Error) return <ViewError primary="Invoices could not be loaded" secondary="An error occurred" />;
  if (!query.data?.length) return <ViewError primary="No invoices found" />;

  return (
    <Table size="small" {...props}>
      <TableBody>
        {
          loadMore.visible.map(item => (
            <InvoicesListItem
              key={item.id}
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