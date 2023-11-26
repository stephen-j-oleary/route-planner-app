import Stripe from "stripe";

import { Skeleton, Typography, TypographyProps } from "@mui/material";

import ViewError from "@/components/ViewError";
import { useGetCustomerById } from "@/shared/reactQuery/useCustomers";
import { selectUser, useGetSession } from "@/shared/reactQuery/useSession";
import formatMoney from "@/shared/utils/formatMoney";


export type CustomerBalanceDetailsProps = TypographyProps;

export default function CustomerBalanceDetail(props: CustomerBalanceDetailsProps) {
  const authUser = useGetSession({ select: selectUser });
  const customer = useGetCustomerById(authUser.data?.customerId);

  if (customer.isIdle || (customer.isLoading && !customer.data)) return <Skeleton width="40%"><Typography variant="h6">.</Typography></Skeleton>;
  if (customer.error instanceof Error) return <ViewError primary="Failed to load customer" secondary={customer.error.message} />;
  if (customer.data?.deleted) return <ViewError secondary="Customer deleted" />;

  const {
    balance,
  } = customer.data as Stripe.Customer;

  return (
    <Typography {...props}>
      <Typography variant="h6" component="span">
        ${formatMoney(Math.abs(balance), { trailingDecimals: 2 })}
      </Typography>
      <Typography variant="body2" component="span" ml={.5}>
        {balance < 0 ? "available" : "due"}
      </Typography>
    </Typography>
  )
}