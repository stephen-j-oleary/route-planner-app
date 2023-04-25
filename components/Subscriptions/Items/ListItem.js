
import NextLink from "next/link";

import { Button, Link, Skeleton, TableCell, TableRow, Typography } from "@mui/material";

import { useGetPriceById } from "@/shared/reactQuery/usePrices";
import { useGetProductById } from "@/shared/reactQuery/useProducts";
import formatMoney from "@/shared/utils/formatMoney";


export default function SubscriptionItemsListItem({ item, ...props }) {
  const { id, subscription, price, quantity } = item;
  const isMetered = price.recurring?.usage_type === "metered";

  const product = useGetProductById(price.product);

  const firstTier = useGetPriceById(price.id, {
    enabled: price.billing_scheme === "tiered",
    select: data => data.tiers[0],
  });

  const unitLabel = product.data?.unit_label?.slice(0, -1) || "unit";


  return (
    <TableRow {...props}>
      <TableCell width="50%">
        <Link
          component={NextLink}
          href={`/profile/subscriptions/${subscription}/items/${id}`}
          color="inherit"
          underline="none"
          sx={{
            "&:hover": { textDecoration: "underline" },
          }}
        >
          <Typography variant="body1">
            {
              product.isSuccess
                ? product.data.name
                : <Skeleton />
            }
          </Typography>
        </Link>
        <Typography variant="body2">
          {
            firstTier.isIdle
              ? `$${formatMoney(price.unit_amount)} per ${unitLabel}`
              : firstTier.isSuccess
              ? `Starting at ${
                [
                  firstTier.data.flat_amount
                    ? `$${formatMoney(firstTier.data.flat_amount)} flat fee`
                    : null,
                  firstTier.data.unit_amount
                    ? `$${formatMoney(firstTier.data.unit_amount)} per ${unitLabel}`
                    : null
                ].filter(item => item).join(" + ")
              }`
              : <Skeleton />
          }
        </Typography>
      </TableCell>

      <TableCell>
        {
          isMetered
            ? (
              <Button
                size="small"
                component={Link}
                href={`/profile/subscriptions/${subscription}/items/${id}/usage`}
              >
                View usage
              </Button>
            )
            : quantity
        }
      </TableCell>

      <TableCell>
        {
          isMetered
            ? "Varies with usage"
            : `$${formatMoney(price.unit_amount * quantity)}`
        }
      </TableCell>
    </TableRow>
  );
}
