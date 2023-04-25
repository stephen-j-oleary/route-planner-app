import moment from "moment";
import { useMemo } from "react";

import HelpIcon from "@mui/icons-material/HelpOutlineRounded";
import { Table, TableBody, TableCell, TableRow, Tooltip, Typography } from "@mui/material";

import TableSkeleton from "@/components/TableSkeleton";
import ViewError from "@/components/ViewError";
import { useGetPaymentMethodById } from "@/shared/reactQuery/usePaymentMethods";


export default function SubscriptionDetails({ loading, error, data, ...props }) {
  const paymentMethodId = data?.default_payment_method
    || data?.default_source;
  const paymentMethod = useGetPaymentMethodById(
    paymentMethodId,
    { enabled: !!paymentMethodId }
  );

  const createdMoment = useMemo(
    () => moment.unix(data?.created),
    [data]
  );
  const currentPeriodStartMoment = useMemo(
    () => moment.unix(data?.current_period_start),
    [data]
  );
  const currentPeriodEndMoment = useMemo(
    () => moment.unix(data?.current_period_end),
    [data]
  );


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
        primary="Subscription could not be loaded"
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
              Created
            </Typography>
          </TableCell>

          <TableCell>
            <Typography variant="body2">
              {createdMoment.format("MMM D, YYYY")}
            </Typography>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>
            <Typography variant="body1">
              Current period
            </Typography>
          </TableCell>

          <TableCell>
            <Typography variant="body2">
              {
                currentPeriodStartMoment.format(
                  currentPeriodStartMoment.year() === currentPeriodEndMoment.year()
                    ? "MMM D"
                    : "MMM D, YYYY"
                )
              } - {
                currentPeriodEndMoment.format("MMM D, YYYY")
              }
            </Typography>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>
            <Typography variant="body1">
              Billing method
            </Typography>
          </TableCell>

          <TableCell>
            <Typography variant="body2">
              <Tooltip
                key="billingMethod"
                title={
                  data?.collection_method === "charge_automatically"
                    ? "The payment method will be automatically charged each billing period"
                    : "An invoice will be sent each billing period"
                }
                placement="bottom-start"
              >
                <span>
                  {
                    data?.collection_method === "charge_automatically"
                      ? "Automatic"
                      : "Manual"
                  } <HelpIcon fontSize="inherit" />
                </span>
              </Tooltip>
            </Typography>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>
            <Typography variant="body1">
              Payment method
            </Typography>
          </TableCell>

          <TableCell>
            <Typography variant="body2">
              {
                paymentMethod.data?.card
                  ? (
                    <span>
                      <Typography
                        component="span"
                        variant="body2"
                        marginRight={.5}
                        sx={{ textTransform: "capitalize" }}
                      >
                        {paymentMethod.data.card?.brand}
                      </Typography>

                      **** {paymentMethod.data.card?.last4}
                    </span>
                  )
                  : "None set"
              }
            </Typography>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}