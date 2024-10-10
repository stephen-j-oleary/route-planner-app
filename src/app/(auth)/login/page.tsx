import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import LoginForm from "@/components/LoginForm";
import { SearchParams } from "@/types/next";
import { auth } from "@/utils/auth";


export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { userId } = await auth(cookies());

  let { callbackUrl, linkAccount } = searchParams;

  callbackUrl = typeof callbackUrl === "string" ? callbackUrl : "/account";
  linkAccount = typeof linkAccount === "string" ? linkAccount : undefined;

  if (userId && !linkAccount) return redirect(callbackUrl);


  return (
    <LoginForm
      callbackUrl={callbackUrl}
      defaultEmail={linkAccount || undefined}
    />
  );
}

export const metadata = {
  title: "Loop Mapping - Login",
};