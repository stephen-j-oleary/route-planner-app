import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

import { ArrowForwardRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Button, Stack, Typography } from "@mui/material";

import InvoiceDetail from "@/components/Invoices/Detail";
import { useCreateUserUpcomingInvoice } from "@/reactQuery/useInvoices";
import { useUpdateUserSubscriptionById } from "@/reactQuery/useSubscriptions";
import formatMoney from "@/utils/formatMoney";


export type CheckoutFormChangeSubscriptionProps = {
  activeSubscriptions: {
    id: string,
    items: {
      data: {
        id: string,
        price: { id: string },
      }[],
    },
  }[],
  newPrice: {
    id: string,
    unit_amount: number,
    currency: string,
    product: { name: string },
    recurring: {
      interval: string,
      interval_count: number,
    },
  },
}

export default function CheckoutFormChangeSubscription({
  activeSubscriptions,
  newPrice,
}: CheckoutFormChangeSubscriptionProps) {
  const router = useRouter();

  const newSubscriptionItems = [{
    id: activeSubscriptions[0]!.items.data[0]?.id || undefined,
    price: newPrice.id,
    quantity: 1,
  }];

  const createUpcomingInvoiceMutation = useCreateUserUpcomingInvoice();

  const changePreview = useQuery({
    queryKey: ["upcomingInvoice", { subscription: activeSubscriptions[0]!.id, price: newPrice.id }],
    queryFn: () => createUpcomingInvoiceMutation.mutateAsync({
      subscription: activeSubscriptions[0]!.id,
      subscription_items: newSubscriptionItems,
      subscription_proration_date: new Date(),
    }),
    refetchOnWindowFocus: false,
  });

  const updateMutation = useUpdateUserSubscriptionById();
  const handleUpdate = () => updateMutation.mutate(
    {
      id: activeSubscriptions[0]!.id,
      items: newSubscriptionItems,
    },
    { onSuccess: () => void router.push("/account/subscriptions") }
  );

  /** Customer is not subscribed to this price */
  const allowChange = !activeSubscriptions.some(sub => sub.items.data.some(item => item.price.id === newPrice.id));

  return (
    <Stack
      spacing={3}
      alignItems="center"
    >
      <Stack spacing={1} alignItems="center">
        <Typography variant="h6">
          Change subscription to {newPrice.product.name}
        </Typography>

        {
          allowChange
            ? (
              <>
                <Stack
                  direction="row"
                  alignItems="flex-end"
                  justifyContent="center"
                >
                  <Typography
                    component="span"
                    variant="h4"
                    sx={{ flex: "0 0 auto" }}
                  >
                    ${formatMoney(newPrice.unit_amount, { trailingDecimals: 0 })} {newPrice.currency.toUpperCase()}
                  </Typography>

                  <Typography
                    component="span"
                    variant="subtitle1"
                    color="text.secondary"
                    ml={1}
                  >
                    per {newPrice.recurring.interval_count > 1 ? `${newPrice.recurring.interval_count} ` : ""}{newPrice.recurring.interval}{newPrice.recurring.interval_count !== 1 ? "s" : ""}
                  </Typography>
                </Stack>

                <Typography variant="body2">
                  Here is an overview of the changes to your subscription
                </Typography>
              </>
            )
            : (
              <Typography variant="body2">
                You are already subscribed to this plan
              </Typography>
            )
        }
      </Stack>

      {
        allowChange
          ? (
            <>
              <InvoiceDetail
                query={changePreview}
                excludeQuantity
                excludeUnitPrice
              />

              <LoadingButton
                size="large"
                variant="contained"
                endIcon={<ArrowForwardRounded />}
                loadingPosition="end"
                loading={updateMutation.isLoading}
                onClick={() => handleUpdate()}
              >
                Subscribe
              </LoadingButton>
            </>
          )
          : (
            <Button
              size="large"
              variant="contained"
              endIcon={<ArrowForwardRounded />}
              component={Link}
              href="/account/subscriptions"
            >
              Manage subscriptions
            </Button>
          )
      }
    </Stack>
  );
}