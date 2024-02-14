import { GetServerSidePropsContext } from "next";
import React from "react";

import { Alert, Container, Typography } from "@mui/material";

import PageHeading from "@/components/ui/PageHeading";
import VerifyForm from "@/components/Users/VerifyForm";
import { NextPageWithLayout } from "@/pages/_app";
import { handleGetVerifySend } from "@/pages/api/user/verify/send";
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

  // Send verification email automatically
  // Don't bother awaiting the resend promise; This will just delay page render further
  const authUser = await getAuthUser(req, res);
  handleGetVerifySend(authUser!.id).catch(console.error);

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
      variant="h2"
      lineHeight={1.75}
    >
      Verify email
    </Typography>

    <Alert
      color="info"
      variant="standard"
      sx={{ my: 2 }}
    >
      {"Check your email for a verification code and enter it here. Don't forget to check your junk folder if you can't find it in your inbox"}
    </Alert>

    <VerifyForm callbackUrl={callbackUrl} />
  </Container>
);

AccountVerifyPage.layoutProps = {
  title: "Verify account",
};


export default AccountVerifyPage;