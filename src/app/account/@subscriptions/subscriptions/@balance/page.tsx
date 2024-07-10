import { cookies } from "next/headers";

import { getUserCustomer } from "@/app/api/user/customer/actions";
import CustomerBalanceDetail from "@/components/CustomerBalanceDetail";
import { auth } from "@/utils/auth";


export default async function BalancePage() {
  const { customerId } = await auth(cookies());

  const customer = customerId ? await getUserCustomer(customerId) : null;

  return (
    <CustomerBalanceDetail
      customer={customer}
      sx={{ paddingX: 2 }}
    />
  );
}