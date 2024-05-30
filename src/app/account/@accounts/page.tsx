import { cookies } from "next/headers";

import AccountsList from "@/components/Accounts/List";
import { getUserAccounts } from "@/services/accounts";
import { auth } from "@/utils/auth";


export default async function Page() {
  const { userId } = await auth(cookies());
  const accounts = userId ? await getUserAccounts() : [];

  return (
    <AccountsList
      dense
      accounts={accounts}
    />
  );
}