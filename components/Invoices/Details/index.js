import moment from "moment";
import Link from "next/link";

import { Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";

import TableSkeleton from "@/components/TableSkeleton";
import ViewError from "@/components/ViewError";
import formatDateRange from "@/shared/utils/formatDateRange";
import formatMoney from "@/shared/utils/formatMoney";


export default function InvoiceDetails({ loading, error, item, ...props }) {
  if (loading) {
    return (
      <TableSkeleton
        {...props}
        rows={4}
        cols={1}
        disableSecondary
      />
    );
  }

  if (error) {
    return (
      <ViewError
        primary="Invoice could not be loaded"
        secondary="An error occurred"
      />
    );
  }

  const formattedPeriod = formatDateRange(
    moment.unix(item.period_start),
    moment.unix(item.period_end)
  );
  const formattedTotal = "$" + formatMoney(item.total);
  const formattedSubtotal = "$" + formatMoney(item.subtotal);

  return (
    <Table {...props}>
      <TableHead>
        <TableRow>
          <TableCell>Description</TableCell>
          <TableCell>Quantity</TableCell>
          <TableCell>Unit price</TableCell>
          <TableCell>Amount</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell colSpan={4}>
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
          item.lines.data.map(invoiceItem => (
            <TableRow key={invoiceItem.id}>
              <TableCell>
                {invoiceItem.description}
              </TableCell>

              <TableCell>
                {
                  invoiceItem.unit_amount_excluding_tax !== null && (
                    <>
                      {invoiceItem.quantity}
                      {
                        (invoiceItem.subscription && invoiceItem.subscription_item) && (
                          <Button
                            size="small"
                            component={Link}
                            href={`/account/subscriptions/${invoiceItem.subscription}/items/${invoiceItem.subscription_item}/usage`}
                            sx={{ marginX: 1 }}
                          >
                            View usage
                          </Button>
                        )
                      }
                    </>
                  )
                }
              </TableCell>

              <TableCell>
                {
                  invoiceItem.unit_amount_excluding_tax !== null
                    && `$${formatMoney(Number(invoiceItem.unit_amount_excluding_tax) * 100)}`
                }
              </TableCell>

              <TableCell>
                ${formatMoney(invoiceItem.amount)}
              </TableCell>
            </TableRow>
          ))
        }

        <TableRow sx={{ borderBottom: 0 }}>
          <TableCell colSpan={2} sx={{ borderBottom: "none" }} />

          <TableCell sx={{ borderBottom: "none" }}>
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

        <TableRow sx={{ borderTop: 0 }}>
          <TableCell colSpan={2} sx={{ borderBottom: "none" }} />

          <TableCell sx={{ borderBottom: "none" }}>
            <Typography
              variant="body2"
              fontWeight={600}
            >
              Total
            </Typography>
          </TableCell>

          <TableCell sx={{ borderBottom: "none" }}>
            {formattedTotal}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}