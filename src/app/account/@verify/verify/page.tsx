import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import UserVerifyAlert from "@/components/Users/Verify/Alert";
import { SearchParams } from "@/types/next";
import { auth } from "@/utils/auth";


export default async function AccountVerifyPage({
  searchParams,
}: {
  searchParams: SearchParams,
}) {
  let { callbackUrl } = searchParams;
  callbackUrl = typeof callbackUrl === "string" ? callbackUrl : "/account";

  const { userId, emailVerified } = await auth(cookies());
  if (!userId) redirect("/login");
  if (emailVerified) redirect(callbackUrl);

  return (
    <UserVerifyAlert
      callbackUrl={callbackUrl}
    />
  );
}

export const metadata = {
  title: "Loop Mapping - Verify Account",
};