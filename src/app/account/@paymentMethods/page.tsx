import { cookies } from "next/headers";

import PaymentMethodsList from "@/components/PaymentMethods/List";
import { getUserPaymentMethods } from "@/services/paymentMethods";
import { auth } from "@/utils/auth";


export default async function Page() {
  const { customerId } = await auth(cookies());
  const paymentMethods = customerId ? await getUserPaymentMethods() : [];

  return (
    <PaymentMethodsList
      paymentMethods={paymentMethods}
      visible={3}
    />
  );
}