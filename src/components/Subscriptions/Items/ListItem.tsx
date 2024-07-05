import "server-only";

import Stripe from "stripe";

import { Skeleton, TableCell, TableRow, TableRowProps, Typography } from "@mui/material";

import { handleGetPriceById } from "@/app/api/prices/[id]/handlers";
import { handleGetProductById } from "@/app/api/products/[id]/handlers";
import formatMoney from "@/utils/formatMoney";


export type SubscriptionItemsListItemProps = TableRowProps & {
  item: Stripe.SubscriptionItem,
};

export default async function SubscriptionItemsListItem({
  item,
  ...props
}: SubscriptionItemsListItemProps) {
  const { price, quantity } = item;
  const productId = typeof price.product === "string" ? price.product : price.product.id;
  const isMetered = price.recurring?.usage_type === "metered";
  const isTiered = price.billing_scheme === "tiered";

  const product = await handleGetProductById(productId);

  const expandedPrice = isTiered ? await handleGetPriceById(price.id) : null;
  const firstTier = expandedPrice?.tiers?.[0];

  const unitLabel = product?.unit_label?.slice(0, -1) || "unit";


  return (
    <TableRow {...props}>
      <TableCell width="50%">
        <Typography variant="body1">
          {product?.name || <Skeleton />}
        </Typography>

        <Typography variant="body2">
          {
            !isTiered
              ? `$${formatMoney(price.unit_amount)} per ${unitLabel}`
              : firstTier
              ? `Starting at ${
                [
                  firstTier.flat_amount
                    ? `$${formatMoney(firstTier.flat_amount)} flat fee`
                    : null,
                  firstTier.unit_amount
                    ? `$${formatMoney(firstTier.unit_amount)} per ${unitLabel}`
                    : null
                ].filter(item => item).join(" + ")
              }`
              : <Skeleton />
          }
        </Typography>
      </TableCell>

      <TableCell>
        {quantity}
      </TableCell>

      <TableCell>
        {
          isMetered
            ? "Varies with usage"
            : `$${formatMoney((price.unit_amount || 0) * (quantity || 0))}`
        }
      </TableCell>
    </TableRow>
  );
}
