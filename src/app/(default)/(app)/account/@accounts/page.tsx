import { cookies } from "next/headers";

import { getUserAccounts } from "@/app/api/user/accounts/actions";
import AccountsList from "@/components/Accounts/List";
import auth from "@/utils/auth";


export default async function Page() {
  await auth(cookies()).flow();

  const accounts = await getUserAccounts().catch(() => []) ?? [];

  return (
    <AccountsList
      dense
      accounts={accounts}
    />
  );
}