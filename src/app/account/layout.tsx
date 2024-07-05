"use client";

import { usePathname } from "next/navigation";
import React from "react";

import { Box, Container, Typography } from "@mui/material";

import NextBreadcrumbs from "@/components/ui/NextBreadcrumbs";
import PageSection from "@/components/ui/PageSection";


export default function Layout({
  children,
  verify,
  profile,
  accounts,
  subscriptions,
  paymentMethods,
}: {
  children: React.ReactNode,
  verify: React.ReactNode,
  profile: React.ReactNode,
  accounts: React.ReactNode,
  subscriptions: React.ReactNode,
  paymentMethods: React.ReactNode,
}) {
  const pathname = usePathname();
  const title = pathname
    ?.split("/")
    .filter(v => v)
    .slice(1)
    .join(" ");

  return (
    <Container maxWidth="sm" sx={{ paddingY: 3 }}>
      <Box>
        <Typography variant="h1" textTransform="capitalize">
          {title}
        </Typography>

        <NextBreadcrumbs />
      </Box>

      {verify}

      {
        pathname?.endsWith("/account")
          && (
            <PageSection
              borders="bottom"
              title="Profile"
              body={profile}
            />
          )
      }

      {
        pathname?.endsWith("/account")
          && (
            <PageSection
              paper
              borders="bottom"
              title="Sign in methods"
              body={accounts}
            />
          )
      }

      {
        pathname?.includes("/subscriptions")
          ? subscriptions
          : pathname?.endsWith("/account")
          && (
            <PageSection
              paper
              borders="bottom"
              title="Subscriptions"
              titleHref="/account/subscriptions"
              body={subscriptions}
            />
          )
      }

      {
        pathname?.includes("/paymentMethods")
          ? paymentMethods
          : pathname?.endsWith("/account")
          && (
            <PageSection
              paper
              borders="bottom"
              title="Payment methods"
              titleHref="/account/paymentMethods"
              body={paymentMethods}
            />
          )
      }

      {children}
    </Container>
  );
}