import Link from "next/link";

import { AddRounded } from "@mui/icons-material";
import { Button, ButtonProps } from "@mui/material";


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
      href="/paymentMethods/setup"
      startIcon={withIcon && <AddRounded />}
      {...props}
    >
      Add payment method
    </Button>
  );
}