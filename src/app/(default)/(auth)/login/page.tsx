import type { Metadata } from "next";

import LoginFormEmail from "@/components/Login/Email";
import pages from "@/pages";
import { PageProps } from "@/types/next";
import auth from "@/utils/auth";
import { parseSearchParams } from "@/utils/auth/utils";


export default async function LoginPage({
  searchParams,
}: PageProps) {
  const { email, callbackUrl, plan } = await parseSearchParams(searchParams, pages.login_password);

  await auth(pages.login).flow({ searchParams });


  return (
    <LoginFormEmail
      defaultEmail={email}
      callbackUrl={callbackUrl}
      plan={plan}
    />
  );
}

export const metadata: Metadata = {
  title: "Loop Mapping - Login",
  description: "Access your Loop Mapping account. Log in to manage your routes and create new ones.",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_BASE_URL}${pages.login}` },
};