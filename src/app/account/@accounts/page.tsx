import { cookies } from "next/headers";

import { getUserAccounts } from "@/app/api/user/accounts/actions";
import AccountsList from "@/components/Accounts/List";
import { auth } from "@/utils/auth";


export default async function Page() {
  const { userId } = await auth(cookies());
  const accounts = userId ? await getUserAccounts({ userId }).catch(() => []) : [];

  return (
    <AccountsList
      dense
      accounts={accounts}
    />
  );
}