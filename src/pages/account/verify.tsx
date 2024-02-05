import { GetServerSidePropsContext } from "next";
import React from "react";

import { Container, Typography } from "@mui/material";

import { handleGetUser } from "../api/user";
import { handleGetVerifyUserResend } from "../api/user/verify/resend";
import DefaultLayout from "@/components/ui/Layouts/Default";
import PageHeading from "@/components/ui/PageHeading";
import VerifyForm from "@/components/Users/VerifyForm";
import { NextPageWithLayout } from "@/pages/_app";
import { getAuthUser } from "@/utils/auth/serverHelpers";


export async function getServerSideProps({ req, res, query }: GetServerSidePropsContext) {
  const NO_USER_REDIRECT = {
    destination: "/login",
    parmanent: false,
  };
  const ALREADY_VERIFIED_REDIRECT = {
    destination: query?.callbackUrl || "/account",
    parmanent: false,
  };

  const authUser = await getAuthUser(req, res);
  if (!authUser) return { redirect: NO_USER_REDIRECT };

  const user = await handleGetUser(authUser.id).catch(() => null);
  if (!user) return { redirect: NO_USER_REDIRECT };
  if (user.emailVerified) return { redirect: ALREADY_VERIFIED_REDIRECT };

  // Send the email
  // Don't await here as that will only slow down the render
  handleGetVerifyUserResend(authUser.id).catch(console.error);

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