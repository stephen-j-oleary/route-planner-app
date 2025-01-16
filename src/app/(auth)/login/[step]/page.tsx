import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import LoginForm from "@/components/LoginForm";
import { PageProps } from "@/types/next";
import { auth } from "@/utils/auth";
import pages from "pages";


export default async function LoginPage({
  params,
  searchParams,
}: PageProps<{ step?: string }>) {
  const { step = "email" } = params;
  const { userId } = await auth(cookies());

  let { callbackUrl, email } = searchParams;

  callbackUrl = typeof callbackUrl === "string" ? callbackUrl : pages.account.root;
  email = typeof email === "string" ? email : undefined;

  if (userId) return redirect(callbackUrl);


  return (
    <LoginForm
      callbackUrl={callbackUrl}
      defaultEmail={email}
      step={step}
    />
  );
}

export const metadata = {
  title: "Loop Mapping - Login",
};