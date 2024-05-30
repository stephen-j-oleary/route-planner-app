import Stripe from "stripe";

import { Typography, TypographyProps } from "@mui/material";

import formatMoney from "@/utils/formatMoney";


export type CustomerBalanceDetailsProps =
  & TypographyProps
  & { customer: Stripe.Customer | Stripe.DeletedCustomer | null };

export default function CustomerBalanceDetail({
  customer,
  ...props
}: CustomerBalanceDetailsProps) {
  const { balance = 0 } = (
    customer?.deleted
      ? { balance: 0 }
      : customer
  ) || {};

  return (
    <Typography {...props}>
      <Typography variant="h6" component="span">
        ${formatMoney(Math.abs(balance), { trailingDecimals: 2 })}
      </Typography>
      <Typography variant="body2" component="span" ml={.5}>
        {balance < 0 && "available"}
        {balance >= 0 && "due"}
      </Typography>
    </Typography>
  );
}