import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

import { getUserAccounts } from "@/app/api/user/accounts/actions";
import ChangePasswordForm from "@/components/Accounts/Actions/Change/Form";
import pages from "@/pages";
import auth from "@/utils/auth";


export default async function ChangePassword() {
  await auth(cookies()).flow();

  const [account] = await getUserAccounts({ provider: "credentials" }).catch(() => []) ?? [];

  if (!account) redirect(pages.account.root, RedirectType.replace);

  return (
    <ChangePasswordForm
      account={account}
    />
  );
}