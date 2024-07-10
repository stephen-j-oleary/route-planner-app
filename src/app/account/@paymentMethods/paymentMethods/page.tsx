import { cookies } from "next/headers";

import { getUserPaymentMethods } from "@/app/api/user/paymentMethods/actions";
import PaymentMethodsList from "@/components/PaymentMethods/List";
import { auth } from "@/utils/auth";


export default async function PaymentMethodsPage() {
  const { customerId } = await auth(cookies());
  const paymentMethods = customerId ? await getUserPaymentMethods({ customer: customerId }) : [];

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