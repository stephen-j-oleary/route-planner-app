import { cookies } from "next/headers";
import React from "react";

import { Box, Container } from "@mui/material";

import NextBreadcrumbs from "@/components/ui/NextBreadcrumbs";
import PageSection from "@/components/ui/PageSection";
import { auth, authRedirect } from "@/utils/auth";
import pages from "pages";


export default async function Layout({
  children,
  verify,
  profile,
  accounts,
  subscriptions,
  paymentMethods,
  invoices,
}: {
  children: React.ReactNode,
  verify: React.ReactNode,
  profile: React.ReactNode,
  accounts: React.ReactNode,
  subscriptions: React.ReactNode,
  paymentMethods: React.ReactNode,
  invoices: React.ReactNode,
}) {
  const { userId } = await auth(cookies());
  if (!userId) return authRedirect(pages.login);


  return (
    <Container maxWidth="sm" sx={{ paddingY: 3 }}>
      <Box>
        <NextBreadcrumbs paths={["account"]} />
      </Box>

      {verify}

      <PageSection
        borders="bottom"
        title="Profile"
        body={profile}
      />

      <PageSection
        paper
        borders="bottom"
        title="Sign in methods"
        body={accounts}
      />

      <PageSection
        paper
        borders="bottom"
        title="Subscriptions"
        body={subscriptions}
      />

      <PageSection
        paper
        borders="bottom"
        title="Payment methods"
        body={paymentMethods}
      />

      <PageSection
        paper
        borders="bottom"
        title="Invoice history"
        body={invoices}
      />

      {children}
    </Container>
  );
}