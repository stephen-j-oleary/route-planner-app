import moment from "moment";
import NextLink from "next/link";

import OpenInNewIcon from "@mui/icons-material/OpenInNewRounded";
import { Chip, Link, Skeleton, TableCell, TableRow, Typography } from "@mui/material";

import { useGetProducts } from "@/shared/reactQuery/useProducts";


export default function InvoicesListItem({ item, ...props }) {
  const product = useGetProducts({
    select: prods => prods.find(prod => prod.id === item.lines.data[0].price.product),
  });

  return (
    <TableRow {...props}>
      <TableCell>
        <Link
          component={NextLink}
          href={item.hosted_invoice_url}
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
            {
              moment.unix(item.period_end).format("MMM Do, YYYY")
            }
            <OpenInNewIcon fontSize="inherit" />
          </Typography>
        </Link>

        <Typography
          component="p"
          variant="body2"
          color="text.secondary"
        >
          {
            product.isSuccess
              ? product.data?.name
              : <Skeleton />
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
          label={item.status}
          sx={{ textTransform: "capitalize" }}
        />
      </TableCell>
    </TableRow>
  );
}

InvoicesListItem.cols = 3;