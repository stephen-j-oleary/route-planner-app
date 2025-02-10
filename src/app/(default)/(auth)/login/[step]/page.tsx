import type { Metadata } from "next";
import Head from "next/head";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import LoginFormPassword from "@/components/LoginForm/Password";
import pages from "@/pages";
import { PageProps } from "@/types/next";
import auth from "@/utils/auth";
import { getCallbackUrl } from "@/utils/auth/utils";
import { appendQuery } from "@/utils/url";


export default async function LoginPage({
  params,
  searchParams,
}: PageProps<{ step?: string }>) {
  const { step = "register" } = params;

  const email = typeof searchParams.email === "string" ? searchParams.email : undefined;
  const callbackUrl = getCallbackUrl({ searchParams, headerStore: headers() });
  const plan = typeof searchParams.plan === "string" ? searchParams.plan : undefined;

  await auth(cookies()).flow({
    step: pages.login,
    callbackUrl,
    plan,
  });

  if (!email) redirect(appendQuery(pages.login, { callbackUrl, plan }));


  return (
    <>
      <Head>
        <link rel="canonical" href={pages.login} />
      </Head>

      <LoginFormPassword
        step={step}
        callbackUrl={callbackUrl}
        plan={plan}
        defaultEmail={email}
      />
    </>
  );
}

export const metadata: Metadata = {
  robots: { index: false },
  title: "Loop Mapping - Login",
}