import { getUserAccounts } from "@/app/api/user/accounts/actions";
import AccountsList from "@/components/Accounts/List";
import pages from "@/pages";
import auth from "@/utils/auth";


export default async function Page() {
  await auth(pages.account.root).flow();

  const accounts = await getUserAccounts().catch(() => []) ?? [];

  return (
    <AccountsList
      dense
      accounts={accounts}
    />
  );
}