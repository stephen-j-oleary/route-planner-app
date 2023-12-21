import moment from "moment";
import { UseQueryResult } from "react-query";
import Stripe from "stripe";

import { Table, TableBody, TableCell, TableHead, TableProps, TableRow, Typography } from "@mui/material";

import TableSkeleton from "@/components/ui/TableSkeleton";
import ViewError from "@/components/ui/ViewError";
import formatDateRange from "@/utils/formatDateRange";
import formatMoney from "@/utils/formatMoney";


export type InvoiceDetailProps = TableProps & {
  query: UseQueryResult<Stripe.Invoice | Stripe.UpcomingInvoice>,
  excludeQuantity?: boolean,
  excludeUnitPrice?: boolean,
};

export default function InvoiceDetail({
  query,
  excludeQuantity = false,
  excludeUnitPrice = false,
  ...props
}: InvoiceDetailProps) {
  const BASE_COLUMN_COUNT = 2;
  const columnCount = BASE_COLUMN_COUNT + (+!excludeQuantity) + (+!excludeUnitPrice);

  if (query.isLoading && !query.data) {
    return (
      <TableSkeleton
        {...props}
        rows={4}
        cols={1}
        disableSecondary
      />
    );
  }

  if (query.error instanceof Error) {
    return (
      <ViewError
        primary="Invoice could not be loaded"
        secondary={query.error.message}
      />
    );
  }

  const {
    period_start,
    period_end,
    lines,
    subtotal,
    starting_balance,
    amount_due,
  } = query.data || {};

  const formattedPeriod = formatDateRange(
    moment.unix(period_start),
    moment.unix(period_end)
  );
  const formattedSubtotal = "$" + formatMoney(subtotal);
  const formattedStartingBalance = "$" + formatMoney(starting_balance);
  const formattedAmountDue = "$" + formatMoney(amount_due);

  return (
    <Table {...props}>
      <TableHead>
        <TableRow>
          <TableCell>Description</TableCell>
          {!excludeQuantity && <TableCell>Quantity</TableCell>}
          {!excludeUnitPrice && <TableCell>Unit price</TableCell>}
          <TableCell>Amount</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell colSpan={columnCount}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textTransform: "uppercase" }}
            >
              {formattedPeriod}
            </Typography>
          </TableCell>
        </TableRow>

        {
          lines.data.map(invoiceItem => (
            <TableRow key={invoiceItem.id}>
              <TableCell width="100%">
                {invoiceItem.description}
              </TableCell>

              {
                !excludeQuantity && (
                  <TableCell>
                    {invoiceItem.quantity}
                  </TableCell>
                )
              }

              {
                !excludeUnitPrice && (
                  <TableCell>
                    {
                      invoiceItem.unit_amount_excluding_tax !== null
                        && `$${formatMoney(Number(invoiceItem.unit_amount_excluding_tax))}`
                    }
                  </TableCell>
                )
              }

              <TableCell>
                ${formatMoney(invoiceItem.amount)}
              </TableCell>
            </TableRow>
          ))
        }

        <TableRow sx={{ borderBottom: 0 }}>
          <TableCell colSpan={columnCount - 1} align="right" sx={{ borderBottom: "none" }}>
            <Typography
              variant="body2"
              fontWeight={600}
            >
              Subtotal
            </Typography>
          </TableCell>

          <TableCell sx={{ borderBottom: "none" }}>
            {formattedSubtotal}
          </TableCell>
        </TableRow>

        {
          starting_balance !== 0 && (
            <TableRow sx={{ borderBottom: 0 }}>
              <TableCell colSpan={columnCount - 1} align="right" sx={{ borderBottom: "none" }}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                >
                  Customer balance
                </Typography>
              </TableCell>

              <TableCell sx={{ borderBottom: "none" }}>
                {formattedStartingBalance}
              </TableCell>
            </TableRow>
          )
        }

        <TableRow sx={{ borderTop: 0 }}>
          <TableCell colSpan={columnCount - 1} align="right" sx={{ borderBottom: "none" }}>
            <Typography
              variant="body2"
              fontWeight={600}
            >
              Amount due
            </Typography>
          </TableCell>

          <TableCell sx={{ borderBottom: "none" }}>
            {formattedAmountDue}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}