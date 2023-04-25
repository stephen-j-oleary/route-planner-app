import moment from "moment";

import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

import TableSkeleton from "@/components/TableSkeleton";
import ViewError from "@/components/ViewError";
import useLoadMore from "@/shared/hooks/useLoadMore";


export default function UsageRecordsList({ loading, error, data, visible, ...props }) {
  const { IncrementButton, ...loadMore } = useLoadMore(data, visible);

  if (loading) {
    return (
      <TableSkeleton
        {...props}
        cols={2}
      />
    );
  }

  if (error) {
    return (
      <ViewError
        primary="Usage records could not be loaded"
        secondary="An error occurred"
      />
    );
  }

  if (data.length === 0) {
    return (
      <ViewError
        primary="No usage records found"
      />
    );
  }

  return (
    <Table {...props}>
      <TableHead>
        <TableRow>
          <TableCell>Quantity</TableCell>
          <TableCell>Period</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {
          loadMore.visible.map((item, i) => (
            <TableRow key={item.id}>
              <TableCell>
                {item.total_usage}
              </TableCell>

              <TableCell>
                {
                  i === 0
                    ? "Current period"
                    : `${
                      moment.unix(item.period.start).format("MMM D")
                    } - ${
                      moment.unix(item.period.end).format("MMM D, YYYY")
                    }`
                }
              </TableCell>
            </TableRow>
          ))
        }

        <TableRow>
          <TableCell
            colSpan={2}
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