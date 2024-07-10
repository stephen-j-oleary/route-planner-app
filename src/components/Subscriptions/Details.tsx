import "server-only";

import moment from "moment";
import { useMemo } from "react";
import Stripe from "stripe";

import HelpIcon from "@mui/icons-material/HelpOutlineRounded";
import { Table, TableBody, TableCell, TableProps, TableRow, Tooltip, Typography } from "@mui/material";

import { getUserPaymentMethodById } from "@/app/api/user/paymentMethods/[id]/actions";


export type SubscriptionDetailsProps =
  & TableProps
  & { subscription: Stripe.Subscription };

export default async function SubscriptionDetails({
  subscription,
  ...props
}: SubscriptionDetailsProps) {
  const { default_payment_method, default_source } = subscription || {};
  const subPaymentMethod = default_payment_method || default_source;
  const paymentMethodId = typeof subPaymentMethod !== "string"
    ? subPaymentMethod?.id
    : subPaymentMethod;

  const paymentMethod = paymentMethodId ? await getUserPaymentMethodById(paymentMethodId) : null;

  const createdMoment = useMemo(
    () => moment.unix(subscription?.created),
    [subscription]
  );
  const currentPeriodStartMoment = useMemo(
    () => moment.unix(subscription?.current_period_start),
    [subscription]
  );
  const currentPeriodEndMoment = useMemo(
    () => moment.unix(subscription?.current_period_end),
    [subscription]
  );

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
                  subscription?.collection_method === "charge_automatically"
                    ? "The payment method will be automatically charged each billing period"
                    : "An invoice will be sent each billing period"
                }
                placement="bottom-start"
              >
                <span>
                  {
                    subscription?.collection_method === "charge_automatically"
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
                paymentMethod?.card
                  ? (
                    <span>
                      <Typography
                        component="span"
                        variant="body2"
                        marginRight={.5}
                        sx={{ textTransform: "capitalize" }}
                      >
                        {paymentMethod.card?.brand}
                      </Typography>

                      **** {paymentMethod.card?.last4}
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