import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

import { getUserAccounts } from "@/app/api/user/accounts/actions";
import ChangePasswordForm from "@/components/Accounts/Actions/Change/Form";
import pages from "@/pages";
import { auth } from "@/utils/auth";
import { fromMongoose } from "@/utils/mongoose";


export default async function ChangePassword() {
  const { userId } = await auth(cookies());
  const [account] = userId ? await getUserAccounts({ userId, provider: "credentials" }).catch(() => []) : [];

  if (!account) return redirect(pages.account.root, RedirectType.replace);

  return (
    <ChangePasswordForm
      account={fromMongoose(account)!}
    />
  );
}