import { cookies } from "next/headers";

import { handleGetUserCustomer } from "@/app/api/user/customer/route";
import CustomerBalanceDetail from "@/components/CustomerBalanceDetail";
import { auth } from "@/utils/auth/server";


export default async function BalancePage() {
  const { customerId } = await auth(cookies());

  const customer = customerId ? await handleGetUserCustomer(customerId) : null;

  return (
    <CustomerBalanceDetail
      customer={customer}
      sx={{ paddingX: 2 }}
    />
  );
}