import "server-only";

import { cookies } from "next/headers";

import { Paper, PaperProps } from "@mui/material";

import { postUserCheckoutSession } from "@/app/api/user/checkoutSession/actions";
import CheckoutForm from "@/components/CheckoutForm";
import { auth } from "@/utils/auth";
import pojo from "@/utils/pojo";


export type PaymentMethodSetupFormProps = PaperProps;

export default async function PaymentMethodSetupForm(props: PaymentMethodSetupFormProps) {
  const { customerId, email } = await auth(cookies());

  const checkoutSession = pojo(
    await postUserCheckoutSession({
      customer: customerId || undefined,
      customer_email: !customerId && email || undefined,
      ui_mode: "embedded",
      mode: "setup",
      return_url: "/account",
    })
  );

  return (
    <Paper
      role="form"
      sx={{ padding: 2 }}
      {...props}
    >
      <CheckoutForm
        checkoutSession={checkoutSession}
      />
    </Paper>
  );
}