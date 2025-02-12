import type { Metadata } from "next";
import Head from "next/head";

import LoginFormEmail from "@/components/Login/Email";
import pages from "@/pages";
import { PageProps } from "@/types/next";
import auth from "@/utils/auth";
import { parseSearchParams } from "@/utils/auth/utils";


export default async function LoginPage({
  searchParams,
}: PageProps) {
  const { email, callbackUrl, plan } = parseSearchParams(searchParams, pages.login_password);

  await auth(pages.login_email).flow({ searchParams });


  return (
    <>
      <Head>
        <link rel="canonical" href={pages.login} />
      </Head>

      <LoginFormEmail
        defaultEmail={email}
        callbackUrl={callbackUrl}
        plan={plan}
      />
    </>
  );
}

export const metadata: Metadata = {
  title: "Loop Mapping - Login",
};