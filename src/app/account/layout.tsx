import { cookies } from "next/headers";
import { ReactNode } from "react";

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
  password,
}: {
  children: ReactNode,
  verify: ReactNode,
  profile: ReactNode,
  accounts: ReactNode,
  subscriptions: ReactNode,
  paymentMethods: ReactNode,
  invoices: ReactNode,
  password: ReactNode,
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

      {password}

      {children}
    </Container>
  );
}