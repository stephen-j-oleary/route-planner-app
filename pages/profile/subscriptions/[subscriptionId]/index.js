import Link from "next/link";

import OpenInNewIcon from "@mui/icons-material/OpenInNewRounded";
import { Button, Container } from "@mui/material";

import AuthGuard from "@/components/AuthGuard";
import ErrorBoundary from "@/components/ErrorBoundary";
import InvoiceDetails from "@/components/Invoices/Details";
import InvoicesList from "@/components/Invoices/List";
import DefaultLayout from "@/components/Layouts/Default";
import PageHeading from "@/components/PageHeading";
import PageSection from "@/components/PageSection";
import { SubscriptionActions } from "@/components/Subscriptions/Actions";
import SubscriptionDetails from "@/components/Subscriptions/Details";
import SubscriptionItemsList from "@/components/Subscriptions/Items/List";
import useRouterQuery from "@/shared/hooks/useRouterQuery";
import { useGetInvoices, useGetUpcomingInvoice } from "@/shared/reactQuery/useInvoices";
import { useGetSubscriptionById } from "@/shared/reactQuery/useSubscriptions";


export default function SubscriptionPage() {
  const query = useRouterQuery();
  const subscriptionId = query.get("subscriptionId");

  const subscription = useGetSubscriptionById(
    subscriptionId,
    { enabled: query.isReady }
  );

  const invoices = useGetInvoices({
    enabled: query.isReady,
    select: data => data.filter(item => item.subscription === subscriptionId),
  });

  const upcomingInvoice = useGetUpcomingInvoice(
    { subscription: subscriptionId },
    { enabled: query.isReady }
  );


  return (
    <ErrorBoundary>
      <AuthGuard>
        <Container maxWidth="md" sx={{ paddingY: 3 }}>
          <PageHeading
            title="Subscription"
            action={
              subscription.isSuccess && (
                <SubscriptionActions subscription={subscription.data} />
              )
            }
          />

          <PageSection
            top
            paper
            title="Subscription details"
            body={
              <SubscriptionDetails
                size="small"
                loading={subscription.isIdle || subscription.isLoading}
                error={subscription.isError}
                data={subscription.isSuccess && subscription.data}
              />
            }
          />

          <PageSection
            paper
            title="Items"
            titleHref={`/profile/subscriptions/${subscriptionId}/items`}
            body={
              <SubscriptionItemsList
                size="small"
                loading={subscription.isIdle || subscription.isLoading}
                error={subscription.isError}
                data={subscription.isSuccess && (subscription.data.items.data || [])}
              />
            }
          />

          <PageSection
            paper
            title="Upcoming invoice"
            action={
              upcomingInvoice.data?.hosted_invoice_url && (
                <Button
                  size="small"
                  component={Link}
                  href={upcomingInvoice.data.hosted_invoice_url}
                  endIcon={<OpenInNewIcon />}
                >
                  View full invoice
                </Button>
              )
            }
            body={
              <InvoiceDetails
                size="small"
                loading={upcomingInvoice.isIdle || upcomingInvoice.isLoading}
                error={upcomingInvoice.isError}
                item={upcomingInvoice.isSuccess && upcomingInvoice.data}
              />
            }
          />

          <PageSection
            paper
            title="Invoices"
            body={
              <InvoicesList
                loading={invoices.isIdle || invoices.isLoading}
                error={invoices.isError}
                data={invoices.isSuccess && invoices.data}
              />
            }
          />
        </Container>
      </AuthGuard>
    </ErrorBoundary>
  );
}

SubscriptionPage.getLayout = props => (
  <DefaultLayout
    title="Subscription"
    headingComponent="p"
    {...props}
  />
);