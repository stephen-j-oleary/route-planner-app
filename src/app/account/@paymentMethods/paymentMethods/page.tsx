import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import PaymentMethodsList from "@/components/PaymentMethods/List";
import { getUserPaymentMethods } from "@/services/paymentMethods";
import { auth } from "@/utils/auth/server";


export default async function PaymentMethodsPage() {
  const { userId, customerId } = await auth(cookies());
  if (!userId) redirect("/login");

  const paymentMethods = customerId ? await getUserPaymentMethods() : [];

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