import { cookies } from "next/headers";
import Link from "next/link";

import OpenInNewIcon from "@mui/icons-material/OpenInNewRounded";
import { Button } from "@mui/material";

import { handleGetUserInvoices } from "@/app/api/user/invoices/route";
import { handleGetUserUpcomingInvoice } from "@/app/api/user/invoices/upcoming/route";
import { handleGetUserSubscriptionById } from "@/app/api/user/subscriptions/[id]/route";
import InvoiceDetail from "@/components/Invoices/Detail";
import InvoicesList from "@/components/Invoices/List";
import { SubscriptionActions } from "@/components/Subscriptions/Actions";
import SubscriptionDetails from "@/components/Subscriptions/Details";
import SubscriptionItemsList from "@/components/Subscriptions/Items/List";
import PageHeading from "@/components/ui/PageHeading";
import PageSection from "@/components/ui/PageSection";
import { PageProps } from "@/types/next";
import { auth } from "@/utils/auth/server";


export default async function SubscriptionPage({
  params,
}: PageProps<{ subscriptionId: string }>) {
  const { customerId } = await auth(cookies());

  const { subscriptionId } = params;

  const subscription = await handleGetUserSubscriptionById(subscriptionId);
  const invoices = customerId ? await handleGetUserInvoices({ customer: customerId, subscription: subscriptionId }) : [];
  const upcomingInvoice = customerId ? await handleGetUserUpcomingInvoice({ customer: customerId, subscription: subscriptionId }) : null;


  return (
    <>
      <PageHeading
        title="Subscription"
        action={
          !!subscription && (
            <SubscriptionActions subscription={subscription} />
          )
        }
      />

      <PageSection
        isTop
        paper
        title="Subscription details"
        body={
          <SubscriptionDetails
            size="small"
            subscription={subscription}
          />
        }
      />

      <PageSection
        paper
        title="Items"
        body={
          <SubscriptionItemsList
            subscriptionItems={subscription?.items.data || []}
            size="small"
            visible={3}
          />
        }
      />

      <PageSection
        paper
        title="Upcoming invoice"
        action={
          upcomingInvoice?.hosted_invoice_url && (
            <Button
              size="small"
              component={Link}
              href={upcomingInvoice.hosted_invoice_url}
              endIcon={<OpenInNewIcon />}
            >
              View full invoice
            </Button>
          )
        }
        body={
          <InvoiceDetail
            size="small"
            invoice={upcomingInvoice}
          />
        }
      />

      <PageSection
        paper
        title="Invoices"
        body={
          <InvoicesList
            invoices={invoices}
            visible={3}
          />
        }
      />
    </>
  );
}

export const metadata = {
  title: "Loop Mapping - Subscription",
};