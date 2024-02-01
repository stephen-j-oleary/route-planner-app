import Stripe from "stripe";

import { Skeleton, Typography, TypographyProps } from "@mui/material";

import ViewError from "@/components/ui/ViewError";
import { useGetUserCustomer } from "@/reactQuery/useCustomers";
import formatMoney from "@/utils/formatMoney";


export type CustomerBalanceDetailsProps = TypographyProps;

export default function CustomerBalanceDetail(props: CustomerBalanceDetailsProps) {
  const customer = useGetUserCustomer();

  if (customer.isIdle || (customer.isLoading && !customer.data)) return <Skeleton width="40%"><Typography variant="h6">.</Typography></Skeleton>;
  if (customer.error instanceof Error) return <ViewError secondary="Customer could not be loaded" />;
  if (customer.data?.deleted) return <ViewError secondary="Customer deleted" />;

  const {
    balance = 0,
  } = customer.data as Stripe.Customer | undefined | null || {};

  return (
    <Typography {...props}>
      <Typography variant="h6" component="span">
        ${formatMoney(Math.abs(balance), { trailingDecimals: 2 })}
      </Typography>
      <Typography variant="body2" component="span" ml={.5}>
        {balance < 0 && "available"}
        {balance > 0 && "due"}
      </Typography>
    </Typography>
  )
}