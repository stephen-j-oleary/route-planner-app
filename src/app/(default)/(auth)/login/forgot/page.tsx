import type { Metadata } from "next";

import LoginFormForgot from "@/components/Login/Forgot";
import pages from "@/pages";
import { PageProps } from "@/types/next";
import auth from "@/utils/auth";
import { parseSearchParams } from "@/utils/auth/utils";


export default async function Page({
  searchParams,
}: PageProps) {
  const { email, callbackUrl, plan } = await parseSearchParams(searchParams, pages.login_forgot);

  await auth(pages.login_forgot).flow({ searchParams });


  return (
    <LoginFormForgot
      callbackUrl={callbackUrl}
      defaultEmail={email}
      plan={plan}
    />
  );
}

export const metadata: Metadata = {
  robots: { index: false },
  title: "Loop Mapping - Forgot Password",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_BASE_URL}${pages.login}` },
};