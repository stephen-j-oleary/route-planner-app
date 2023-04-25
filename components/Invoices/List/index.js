import { Table, TableBody, TableCell, TableRow } from "@mui/material";

import InvoicesListItem from "../ListItem";
import TableSkeleton from "@/components/TableSkeleton";
import ViewError from "@/components/ViewError";
import useLoadMore from "@/shared/hooks/useLoadMore";


export default function InvoicesList({ loading, error, data, visible, ...props }) {
  const { IncrementButton, ...loadMore } = useLoadMore(data, visible);

  if (loading) {
    return (
      <TableSkeleton
        size="small"
        cols={InvoicesListItem.cols}
      />
    );
  }

  if (error) {
    return (
      <ViewError
        primary="Invoices could not be loaded"
        secondary="An error occurred"
      />
    );
  }

  if (data.length === 0) {
    return (
      <ViewError
        primary="No invoices found"
      />
    );
  }

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