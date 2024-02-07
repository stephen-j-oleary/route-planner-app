import { GetServerSidePropsContext } from "next";
import React from "react";

import { Container, Typography } from "@mui/material";

import DefaultLayout from "@/components/ui/Layouts/Default";
import PageHeading from "@/components/ui/PageHeading";
import VerifyForm from "@/components/Users/VerifyForm";
import { NextPageWithLayout } from "@/pages/_app";
import { handleGetVerify } from "@/pages/api/user/verify";
import { handleGetVerifyUserResend } from "@/pages/api/user/verify/resend";
import { getAuthUser } from "@/utils/auth/serverHelpers";
import serverSideAuth, { ServerSideAuthRedirects } from "@/utils/auth/serverSideAuth";


export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { req, res, query } = ctx;
  const callbackUrl = query.callbackUrl;
  const redirects: ServerSideAuthRedirects = {
    noUser: "/login",
    isVerified: typeof callbackUrl === "string" ? callbackUrl : "/account",
  };

  const response = await serverSideAuth(ctx, redirects);
  if (response) return response;

  // Send verification email automatically if no token is found for the user
  // Don't bother awaiting the resend promise; This will just delay page render further
  const authUser = await getAuthUser(req, res);
  const token = await handleGetVerify(authUser!.id).catch(() => null);
  if (!token) handleGetVerifyUserResend(authUser!.id).catch(console.error);

  return { props: query || {} };
}

type AccountVerifyPageProps = {
  callbackUrl?: string,
};

const AccountVerifyPage: NextPageWithLayout<AccountVerifyPageProps> = ({ callbackUrl }) => (
  <Container maxWidth="sm" sx={{ paddingY: 3 }}>
    <PageHeading />

    <Typography
      component="h1"
      variant="h4"
      pb={2}
    >
      Verify email
    </Typography>

    <Typography
      component="p"
      variant="body2"
      pb={3}
    >
      {"Check your email for a verification code and enter it here. Don't forget to check your junk folder if you can't find an email"}
    </Typography>

    <VerifyForm callbackUrl={callbackUrl} />
  </Container>
);

AccountVerifyPage.getLayout = props => (
  <DefaultLayout
    title="Verify account"
    headingComponent="p"
    {...props}
  />
);

export default AccountVerifyPage;