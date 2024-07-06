"use client";

import { usePathname } from "next/navigation";

import PageSection from "@/components/ui/PageSection";


export type SlotsProps = {
  children: React.ReactNode,
  verify: React.ReactNode,
  profile: React.ReactNode,
  accounts: React.ReactNode,
  subscriptions: React.ReactNode,
  paymentMethods: React.ReactNode,
};


export default function Slots({
  children,
  verify,
  profile,
  accounts,
  subscriptions,
  paymentMethods,
}: SlotsProps) {
  const pathname = usePathname();

  return (
    <>
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
    </>
  )
}