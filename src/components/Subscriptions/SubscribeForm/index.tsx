"use client";

import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";

import { ArrowForwardRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Stack, Typography } from "@mui/material";

import subscribe from "./action";
import FormSubmit from "@/components/ui/FormSubmit";
import { StripePriceActiveExpandedProduct } from "@/models/Price";
import formatMoney from "@/utils/formatMoney";


export default function SubscribeForm({
  price,
}: {
  price: StripePriceActiveExpandedProduct,
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const searchParams = useSearchParams();

  const [, formAction] = useActionState(
    () => subscribe({ priceId: price.id, searchParams }),
    null,
  );

  useEffect(
    () => {
      if (price.unit_amount === 0) formRef.current?.requestSubmit();
    },
    [price]
  );

  return (
    <form ref={formRef} action={formAction}>
      <Stack spacing={4}>
        <div>
          <Typography variant="body2">
            Subscribe to {price.product.name}
          </Typography>

          <Typography component="p" variant="h4" lineHeight={1.5}>
            ${formatMoney(price.unit_amount, { trailingDecimals: 0 })} {price.currency.toUpperCase()} per {price.recurring?.interval}
          </Typography>
        </div>

        <FormSubmit
          renderSubmit={status => (
            <LoadingButton
              fullWidth
              variant="contained"
              size="large"
              endIcon={<ArrowForwardRounded />}
              loadingPosition="end"
              loading={status.pending}
            >
              Subscribe
            </LoadingButton>
          )}
        />
      </Stack>
    </form>
  );
}