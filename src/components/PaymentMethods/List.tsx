import Link from "next/link";
import { UseQueryResult } from "react-query";
import Stripe from "stripe";

import { AddRounded } from "@mui/icons-material";
import { Button, List, ListItem, ListProps, Stack } from "@mui/material";

import PaymentMethodsListItem from "./ListItem";
import ListSkeleton from "@/components/ui/ListSkeleton";
import ViewError from "@/components/ui/ViewError";
import useLoadMore from "@/hooks/useLoadMore";


export type PaymentMethodsListProps = ListProps & {
  paymentMethodsQuery: UseQueryResult<Stripe.PaymentMethod[]>,
  visible?: number,
}

export default function PaymentMethodsList({
  paymentMethodsQuery,
  visible,
  ...props
}: PaymentMethodsListProps) {
  const { incrementButtonProps, ...loadMore } = useLoadMore(paymentMethodsQuery.data || [], visible);

  if (paymentMethodsQuery.isLoading && !paymentMethodsQuery.data) return <ListSkeleton disablePadding rowProps={{ divider: true }} />;
  if (paymentMethodsQuery.isError) return <ViewError secondary="Payment methods could not be loaded" />;
  if (paymentMethodsQuery.isIdle || !paymentMethodsQuery.data?.length) {
    return (
      <ViewError
        primary="No payment methods found"
        secondary="Looks like you haven't added a payment method yet"
        action={
          <Stack alignItems="center">
            <Button
              variant="text"
              size="medium"
              component={Link}
              href="/paymentMethods/setup"
              startIcon={<AddRounded />}
            >
              Add a payment method
            </Button>
          </Stack>
        }
      />
    );
  }

  return (
    <List disablePadding {...props}>
      {
        loadMore.visible.map(item => (
          <PaymentMethodsListItem
            key={item.id}
            paymentMethod={item}
          />
        ))
      }

      <ListItem dense disablePadding>
        <Button
          fullWidth
          sx={{ fontSize: "caption.fontSize" }}
          {...incrementButtonProps}
        />
      </ListItem>
    </List>
  );
}