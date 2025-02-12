import type { Metadata } from "next";
import Head from "next/head";

import LoginFormChange from "@/components/Login/Change";
import pages from "@/pages";
import { PageProps } from "@/types/next";
import auth from "@/utils/auth";
import { parseSearchParams } from "@/utils/auth/utils";


export default async function Page({
  searchParams,
}: PageProps) {
  const { callbackUrl, plan } = parseSearchParams(searchParams, pages.login_change);

  const { user } = await auth(pages.login_change).flow({ searchParams });


  return (
    <>
      <Head>
        <link rel="canonical" href={pages.login} />
      </Head>

      <LoginFormChange
        userEmail={user!.email}
        callbackUrl={callbackUrl}
        plan={plan}
      />
    </>
  );
}

export const metadata: Metadata = {
  robots: { index: false },
  title: "Loop Mapping - Change Password",
};