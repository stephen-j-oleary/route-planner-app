import { cookies } from "next/headers";

import { getUserCustomer } from "@/app/api/user/customer/actions";
import { getUserPaymentMethods } from "@/app/api/user/paymentMethods/actions";
import PaymentMethodsList from "@/components/PaymentMethods/List";
import { auth } from "@/utils/auth";


export default async function Page() {
  const { customerId } = await auth(cookies());
  const customer = customerId ? await getUserCustomer(customerId) : null;
  const paymentMethods = customerId ? await getUserPaymentMethods({ customer: customerId }) : [];

  return (
    <PaymentMethodsList
      customer={customer}
      paymentMethods={paymentMethods}
      visible={3}
    />
  );
}