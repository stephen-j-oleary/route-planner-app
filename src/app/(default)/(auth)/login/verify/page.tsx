import type { Metadata } from "next";
import Head from "next/head";

import LoginFormVerify from "@/components/Login/Verify";
import pages from "@/pages";
import { PageProps } from "@/types/next";
import auth from "@/utils/auth";
import { parseSearchParams } from "@/utils/auth/utils";


export default async function Page({
  searchParams,
}: PageProps) {
  const { email, callbackUrl, plan, intent } = parseSearchParams(searchParams, pages.login_verify);

  const { user } = await auth(pages.login_verify).flow({ searchParams });


  return (
    <>
      <Head>
        <link rel="canonical" href={pages.login} />
      </Head>

      <LoginFormVerify
        intent={intent ?? "login"}
        callbackUrl={callbackUrl}
        email={(user?.email ?? email)!}
        plan={plan}
      />
    </>
  );
}

export const metadata: Metadata = {
  robots: { index: false },
  title: "Loop Mapping - Verify Email",
};