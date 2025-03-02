import type { Metadata } from "next";

import LoginFormVerify from "@/components/Login/Verify";
import pages from "@/pages";
import { PageProps } from "@/types/next";
import auth from "@/utils/auth";
import { parseSearchParams } from "@/utils/auth/utils";


export default async function Page({
  searchParams,
}: PageProps) {
  const { email, callbackUrl, plan, intent } = await parseSearchParams(searchParams, pages.login_verify);

  const { user } = await auth(pages.login_verify).flow({ searchParams });


  return (
    <LoginFormVerify
      intent={intent ?? "login"}
      callbackUrl={callbackUrl}
      email={(user?.email ?? email)!}
      plan={plan}
    />
  );
}

export const metadata: Metadata = {
  robots: { index: false },
  title: "Loop Mapping - Verify Email",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_BASE_URL}${pages.login}` },
};