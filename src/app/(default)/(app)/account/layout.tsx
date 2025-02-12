import Link from "next/link";
import { ReactNode } from "react";

import { Box, Button, Container } from "@mui/material";

import OpenBillingPortal from "@/components/BillingPortal/Open";
import Footer from "@/components/ui/Footer";
import NextBreadcrumbs from "@/components/ui/NextBreadcrumbs";
import PageSection from "@/components/ui/PageSection";
import pages from "@/pages";
import auth from "@/utils/auth";


export default async function Layout({
  children,
  profile,
  accounts,
  subscriptions,
  paymentMethods,
  invoices,
  password,
}: {
  children: ReactNode,
  profile: ReactNode,
  accounts: ReactNode,
  subscriptions: ReactNode,
  paymentMethods: ReactNode,
  invoices: ReactNode,
  password: ReactNode,
}) {
  await auth(pages.account.root).flow();


  return (
    <>
      <Container maxWidth="sm" sx={{ paddingY: 3 }}>
        <Box>
          <NextBreadcrumbs paths={["account"]} />
        </Box>

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
          action={<Button component={Link} href={pages.login_change}>Change password</Button>}
        />

        <PageSection
          paper
          borders="bottom"
          title="Subscriptions"
          body={subscriptions}
          action={<OpenBillingPortal returnUrl={pages.account.root}>Manage Subscription</OpenBillingPortal>}
          />

        <PageSection
          paper
          borders="bottom"
          title="Payment methods"
          body={paymentMethods}
          action={<OpenBillingPortal returnUrl={pages.account.root}>Manage Payments</OpenBillingPortal>}
        />

        <PageSection
          paper
          borders="bottom"
          title="Invoices"
          body={invoices}
        />

        {password}

        {children}
      </Container>

      <Footer />
    </>
  );
}