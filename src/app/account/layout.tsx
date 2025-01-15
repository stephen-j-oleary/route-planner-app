import { cookies } from "next/headers";
import Link from "next/link";
import { ReactNode } from "react";

import { Box, Button, Container } from "@mui/material";

import { postUserBillingPortal } from "../api/user/billingPortal/actions";
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
  const { userId, customerId } = await auth(cookies());
  if (!userId) return authRedirect(pages.login);

  const billingPortal = customerId ? await postUserBillingPortal({ customer: customerId!, return_url: pages.account.root }) : null;


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
        action={billingPortal && <Button component={Link} href={billingPortal.url}>Manage Subscription</Button>}
        />

      <PageSection
        paper
        borders="bottom"
        title="Payment methods"
        body={paymentMethods}
        action={billingPortal && <Button component={Link} href={billingPortal.url}>Manage Payments</Button>}
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
  );
}