import { cookies } from "next/headers";

import { getUserCustomer } from "@/app/api/user/customer/actions";
import { getUserPaymentMethods } from "@/app/api/user/paymentMethods/actions";
import PaymentMethodsList from "@/components/PaymentMethods/List";
import auth from "@/utils/auth";


export default async function Page() {
  await auth(cookies()).flow();

  const customer = await getUserCustomer().catch(() => null);
  const paymentMethods = await getUserPaymentMethods().catch(() => []);

  return (
    <PaymentMethodsList
      customer={customer}
      paymentMethods={paymentMethods}
      visible={3}
    />
  );
}