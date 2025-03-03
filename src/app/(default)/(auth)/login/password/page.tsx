import type { Metadata } from "next";

import { getAccounts } from "@/app/api/accounts/actions";
import LoginFormPassword from "@/components/Login/Password";
import pages from "@/pages";
import { PageProps } from "@/types/next";
import auth from "@/utils/auth";
import { parseSearchParams } from "@/utils/auth/utils";


export default async function Page({
  searchParams,
}: PageProps) {
  const { email, callbackUrl, plan } = await parseSearchParams(searchParams, pages.login_password);

  await auth(pages.login_password).flow({ searchParams });

  const accounts = await getAccounts({ userEmail: email });
  const isNew = !accounts.length;

  /* if (accounts.length && !accounts.find(v => v.provider === "credentials")) {
    throw new Error(`This account doesn't have a password. Use one of the following sign in methods: ${accounts.map(item => capitalize(item.provider)).join(", ")}`)
  } */


  return (
    <LoginFormPassword
      isNew={isNew}
      email={email!}
      callbackUrl={callbackUrl}
      plan={plan}
    />
  );
}

export const metadata: Metadata = {
  robots: { index: false },
  title: "Loop Mapping - Login",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_BASE_URL}${pages.login}` },
}