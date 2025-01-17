import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Typography } from "@mui/material";

import VerifyForm from "@/components/Users/Verify/Form";
import ResendButton from "@/components/Users/Verify/Form/ResendButton";
import { SearchParams } from "@/types/next";
import { auth, authRedirect } from "@/utils/auth";
import pages from "pages";


export default async function VerifyPage({
  searchParams,
}: {
  searchParams: SearchParams,
}) {
  let { callbackUrl } = searchParams;
  callbackUrl = typeof callbackUrl === "string" ? callbackUrl : "/account";

  const { userId, emailVerified } = await auth(cookies());
  if (!userId) return authRedirect(pages.login);
  if (emailVerified) return redirect(callbackUrl);

  return (
    <>
      <Typography component="h1" variant="h3" pb={3}>
        Verify Email
      </Typography>

      <Typography variant="caption">
        Check your email for a verification code and enter it here. Don&apos;t forget to check your junk folder if you can&apos;t find an email. <ResendButton size="small" />
      </Typography>

      <VerifyForm
        callbackUrl={callbackUrl}
      />
    </>
  );
}

export const metadata = {
  title: "Loop Mapping - Verify Account",
};