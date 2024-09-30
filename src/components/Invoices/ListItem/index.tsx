import moment from "moment";
import NextLink from "next/link";
import Stripe from "stripe";

import OpenInNewIcon from "@mui/icons-material/OpenInNewRounded";
import { Chip, Link, Skeleton, TableCell, TableRow, TableRowProps, Typography } from "@mui/material";

import { StripePriceActiveExpandedProduct } from "@/models/Price";


export type InvoicesListItemProps = TableRowProps & {
  item: Stripe.Invoice | Stripe.UpcomingInvoice,
  prices: StripePriceActiveExpandedProduct[],
};

export default function InvoicesListItem({
  item,
  prices,
  ...props
}: InvoicesListItemProps) {
  const { hosted_invoice_url } = item;
  const product = item.lines.data[0]?.price?.product;
  const productId = typeof product !== "string"
    ? product?.id
    : product;

  const expandedProduct = productId ? prices.find(item => item.product.id === productId)?.product : null;


  return (
    <TableRow {...props}>
      <TableCell>
        {
          hosted_invoice_url
            ? (
              <Link
                component={NextLink}
                href={hosted_invoice_url}
                target="_blank"
                rel="noopener"
                color="inherit"
                underline="none"
                sx={{
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                <Typography
                  component="span"
                  variant="body1"
                >
                  {moment.unix(item.period_end).format("MMM Do, YYYY")}
                  <OpenInNewIcon fontSize="inherit" />
                </Typography>
              </Link>
            )
            : (
              <Typography
                component="span"
                variant="body1"
              >
                {moment.unix(item.period_end).format("MMM Do, YYYY")}
              </Typography>
            )
        }

        <Typography
          component="p"
          variant="body2"
          color="text.secondary"
        >
          {
            expandedProduct?.name || <Skeleton />
          }
        </Typography>
      </TableCell>

      <TableCell>
        <Typography
          component="span"
          variant="body1"
        >
          ${item.total / 100}
        </Typography>
      </TableCell>

      <TableCell>
        <Chip
          size="small"
          label={
            (item.status === "paid" && item.total < item.amount_paid)
              ? "Credited"
              : item.status
          }
          sx={{ textTransform: "capitalize" }}
        />
      </TableCell>
    </TableRow>
  );
}

InvoicesListItem.cols = 3;