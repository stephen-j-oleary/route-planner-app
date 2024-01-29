import { isArray, isString } from "lodash";
import Link from "next/link";

import OpenInNewIcon from "@mui/icons-material/OpenInNewRounded";
import { Button, Container } from "@mui/material";

import InvoiceDetails from "@/components/Invoices/Detail";
import InvoicesList from "@/components/Invoices/List";
import { SubscriptionActions } from "@/components/Subscriptions/Actions";
import SubscriptionDetails from "@/components/Subscriptions/Details";
import SubscriptionItemsList from "@/components/Subscriptions/Items/List";
import AuthGuard from "@/components/ui/AuthGuard";
import DefaultLayout from "@/components/ui/Layouts/Default";
import PageHeading from "@/components/ui/PageHeading";
import PageSection from "@/components/ui/PageSection";
import useRouterQuery from "@/hooks/useRouterQuery";
import { useGetInvoices, useGetUpcomingInvoice } from "@/reactQuery/useInvoices";
import { useGetUserSubscriptionById } from "@/reactQuery/useSubscriptions";


export default function SubscriptionPage() {
  const query = useRouterQuery();
  let subscriptionId = query.get("subscriptionId");
  if (isArray(subscriptionId)) subscriptionId = subscriptionId[0];

  const subscription = useGetUserSubscriptionById(subscriptionId);

  const invoices = useGetInvoices({
    enabled: query.isReady,
    select: data => data.filter(item => item.subscription === subscriptionId),
  });

  const upcomingInvoice = useGetUpcomingInvoice(
    { subscription: isString(subscriptionId) ? subscriptionId : undefined },
    { enabled: query.isReady }
  );


  return (
    <AuthGuard>
      <Container maxWidth="md" sx={{ paddingY: 3 }}>
        <PageHeading
          title="Subscription"
          action={
            !!subscription.data && (
              <SubscriptionActions subscription={subscription.data} />
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
              loading={subscription.isIdle || subscription.isLoading}
              error={subscription.isError}
              data={subscription.isSuccess && subscription.data}
            />
          }
        />

        <PageSection
          paper
          title="Items"
          titleHref={`/account/subscriptions/${subscriptionId}/items`}
          body={
            <SubscriptionItemsList
              size="small"
              query={{
                ...subscription,
                data: subscription.data?.items.data,
              }}
              visible={3}
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
              query={upcomingInvoice}
            />
          }
        />

        <PageSection
          paper
          title="Invoices"
          body={
            <InvoicesList
              query={invoices}
              visible={3}
            />
          }
        />
      </Container>
    </AuthGuard>
  );
}

SubscriptionPage.getLayout = props => (
  <DefaultLayout
    title="Subscription"
    headingComponent="p"
    {...props}
  />
);