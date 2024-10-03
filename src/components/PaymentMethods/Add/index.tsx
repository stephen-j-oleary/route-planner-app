import Link from "next/link";

import { AddRounded } from "@mui/icons-material";
import { Button, ButtonProps } from "@mui/material";

import pages from "pages";


export type AddPaymentMethodProps =
  & ButtonProps
  & { withIcon?: boolean };

export default function AddPaymentMethod({
  withIcon = false,
  ...props
}: AddPaymentMethodProps) {
  return (
    <Button
      component={Link}
      href={pages.payments.setup}
      startIcon={withIcon && <AddRounded />}
      {...props}
    >
      Add payment method
    </Button>
  );
}