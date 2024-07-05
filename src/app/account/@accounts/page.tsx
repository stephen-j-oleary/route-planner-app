import { cookies } from "next/headers";

import { handleGetUserAccounts } from "@/app/api/user/accounts/route";
import AccountsList from "@/components/Accounts/List";
import { auth } from "@/utils/auth/server";


export default async function Page() {
  const { userId } = await auth(cookies());
  const accounts = userId ? await handleGetUserAccounts({ userId }).catch(() => []) : [];

  return (
    <AccountsList
      dense
      accounts={accounts}
    />
  );
}