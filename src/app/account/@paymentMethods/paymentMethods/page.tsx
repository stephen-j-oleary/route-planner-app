import { cookies } from "next/headers";

import { handleGetUserPaymentMethods } from "@/app/api/user/paymentMethods/route";
import PaymentMethodsList from "@/components/PaymentMethods/List";
import { auth } from "@/utils/auth/server";


export default async function PaymentMethodsPage() {
  const { customerId } = await auth(cookies());
  const paymentMethods = customerId ? await handleGetUserPaymentMethods({ customer: customerId }) : [];

  return (
    <PaymentMethodsList
      paymentMethods={paymentMethods}
      visible={6}
    />
  );
}

export const metadata = {
  title: "Loop Mapping - Payment Methods",
};