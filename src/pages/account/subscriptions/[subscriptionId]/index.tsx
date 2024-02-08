import { isArray } from "lodash";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";

import OpenInNewIcon from "@mui/icons-material/OpenInNewRounded";
import { Button, Container } from "@mui/material";

import InvoiceDetails from "@/components/Invoices/Detail";
import InvoicesList from "@/components/Invoices/List";
import { SubscriptionActions } from "@/components/Subscriptions/Actions";
import SubscriptionDetails from "@/components/Subscriptions/Details";
import SubscriptionItemsList from "@/components/Subscriptions/Items/List";
import PageHeading from "@/components/ui/PageHeading";
import PageSection from "@/components/ui/PageSection";
import useRouterQuery from "@/hooks/useRouterQuery";
import { NextPageWithLayout } from "@/pages/_app";
import { useGetUserInvoices, useGetUserUpcomingInvoice } from "@/reactQuery/useInvoices";
import { useGetUserSubscriptionById } from "@/reactQuery/useSubscriptions";
import serverSideAuth, { ServerSideAuthRedirects } from "@/utils/auth/serverSideAuth";


export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const redirects: ServerSideAuthRedirects = {
    noUser: "/login",
  };

  return (
    (await serverSideAuth(ctx, redirects))
    || { props: {} }
  );
}

const SubscriptionPage: NextPageWithLayout = () => {
  const query = useRouterQuery();
  let subscriptionId = query.get("subscriptionId");
  if (isArray(subscriptionId)) subscriptionId = subscriptionId[0];

  const subscription = useGetUserSubscriptionById(subscriptionId);
  const invoices = useGetUserInvoices({ params: { subscription: subscriptionId } });
  const upcomingInvoice = useGetUserUpcomingInvoice({ subscription: subscriptionId });


  return (
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
  );
};

SubscriptionPage.layoutProps = {
  title: "Subscription",
};


export default SubscriptionPage;