import { cookies } from "next/headers";

import CustomerBalanceDetail from "@/components/CustomerBalanceDetail";
import { getUserCustomer } from "@/services/customer";
import { auth } from "@/utils/auth";


export default async function BalancePage() {
  const { customerId } = await auth(cookies());

  const customer = customerId ? await getUserCustomer() : null;

  return (
    <CustomerBalanceDetail
      customer={customer}
      sx={{ paddingX: 2 }}
    />
  );
}