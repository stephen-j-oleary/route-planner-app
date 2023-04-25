import { Skeleton, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";

import TableSkeleton from "@/components/TableSkeleton";
import ViewError from "@/components/ViewError";
import { useGetPriceById } from "@/shared/reactQuery/usePrices";
import { useGetProductById } from "@/shared/reactQuery/useProducts";
import formatMoney from "@/shared/utils/formatMoney";


export default function SubscriptionItemDetails({ loading, error, data, ...props }) {
  const { price } = data || {};

  const product = useGetProductById(
    price?.product,
    { enabled: !loading }
  );

  const firstTier = useGetPriceById(
    price?.id,
    {
      enabled: !loading && price?.billing_scheme === "tiered",
      select: data => data.tiers[0],
    }
  );

  const unitLabel = product.data?.unit_label?.slice(0, -1) || "unit";


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
        primary="Subscription item could not be loaded"
        secondary="An error occurred"
      />
    );
  }

  return (
    <Table {...props}>
      <TableBody>
        <TableRow>
          <TableCell>
            <Typography variant="body1">
              Product
            </Typography>
          </TableCell>

          <TableCell>
            <Typography variant="body2">
              {
                product.isSuccess
                  ? product.data.name
                  : <Skeleton />
              }
            </Typography>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>
            <Typography variant="body1">
              Price
            </Typography>
          </TableCell>

          <TableCell>
            <Typography variant="body2">
              {
                firstTier.isIdle
                  ? `$${formatMoney(price?.unit_amount)} per ${unitLabel}`
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
        </TableRow>
      </TableBody>
    </Table>
  );
}