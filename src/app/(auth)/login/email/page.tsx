import { cookies, headers } from "next/headers";

import LoginFormEmail from "@/components/LoginForm/Email";
import pages from "@/pages";
import { PageProps } from "@/types/next";
import auth from "@/utils/auth";
import { getCallbackUrl } from "@/utils/auth/utils";


export default async function LoginPage({
  searchParams,
}: PageProps) {
  const email = typeof searchParams.email === "string" ? searchParams.email : undefined;
  const callbackUrl = getCallbackUrl({ searchParams, headerStore: headers() });
  const plan = typeof searchParams.plan === "string" ? searchParams.plan : undefined;

  await auth(cookies()).flow({
    step: pages.login,
    callbackUrl,
    plan,
  });


  return (
    <LoginFormEmail
      callbackUrl={callbackUrl}
      plan={plan}
      defaultEmail={email}
    />
  );
}

export const metadata = {
  title: "Loop Mapping - Login",
};