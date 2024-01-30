import { isString } from "lodash";
import Stripe from "stripe";

import { Skeleton, TableCell, TableRow, TableRowProps, Typography } from "@mui/material";

import { useGetPriceById } from "@/reactQuery/usePrices";
import { useGetProductById } from "@/reactQuery/useProducts";
import formatMoney from "@/utils/formatMoney";


export type SubscriptionItemsListItemProps = TableRowProps & {
  item: Stripe.SubscriptionItem,
};

export default function SubscriptionItemsListItem({
  item,
  ...props
}: SubscriptionItemsListItemProps) {
  const { price, quantity } = item;
  const productId = isString(price.product) ? price.product : price.product.id;
  const isMetered = price.recurring?.usage_type === "metered";

  const product = useGetProductById(productId);

  const firstTier = useGetPriceById(price.id, {
    enabled: price.billing_scheme === "tiered",
    select: data => data?.tiers?.[0],
  });

  const unitLabel = product.data?.unit_label?.slice(0, -1) || "unit";


  return (
    <TableRow {...props}>
      <TableCell width="50%">
        <Typography variant="body1">
          {product.data?.name || <Skeleton />}
        </Typography>

        <Typography variant="body2">
          {
            firstTier.isIdle
              ? `$${formatMoney(price.unit_amount)} per ${unitLabel}`
              : firstTier.data
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
