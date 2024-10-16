"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import Stripe from "stripe";

import { ArrowForwardRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Button, Stack, Typography } from "@mui/material";

import { patchUserSubscriptionById } from "@/app/api/user/subscriptions/[id]/actions";
import InvoiceDetail from "@/components/Invoices/Detail";
import formatMoney from "@/utils/formatMoney";
import pages from "pages";


export type SubscribeChangeFormProps = {
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
  newSubscriptionItems: {
    id: string | undefined,
    price: string,
    quantity: number,
  }[],
  changePreview: Stripe.UpcomingInvoice | null,
};

export default function SubscribeChangeForm({
  activeSubscriptions,
  newPrice,
  newSubscriptionItems,
  changePreview,
}: SubscribeChangeFormProps) {
  const [, action] = React.useActionState(
    async (prevState: Stripe.Subscription | null, id: string) => {
      await patchUserSubscriptionById(id, { items: newSubscriptionItems });
      redirect(pages.account.root);
    },
    null,
  );
  const [isPending, startTransition] = React.useTransition();

  const handleUpdate = () => startTransition(() => action(activeSubscriptions[0].id));

  /** Customer is not subscribed to this price */
  const allowChange = !activeSubscriptions.some(sub => sub.items.data.some(item => item.price.id === newPrice.id));

  return (
    <Stack
      spacing={3}
      alignItems="center"
    >
      <Stack spacing={1} alignItems="center">
        <Typography variant="h5">
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
                    variant="h3"
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
                invoice={changePreview}
                excludeQuantity
                excludeUnitPrice
              />

              <LoadingButton
                size="large"
                variant="contained"
                endIcon={<ArrowForwardRounded />}
                loadingPosition="end"
                loading={isPending}
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
              href={pages.account.root}
            >
              Manage subscriptions
            </Button>
          )
      }
    </Stack>
  );
}