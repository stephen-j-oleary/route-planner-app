import { GetServerSidePropsContext } from "next";

import { Container } from "@mui/material";

import CustomerBalanceDetail from "@/components/CustomerBalanceDetail";
import InvoicesList from "@/components/Invoices/List";
import SubscriptionsList from "@/components/Subscriptions/List";
import PageHeading from "@/components/ui/PageHeading";
import PageSection from "@/components/ui/PageSection";
import { NextPageWithLayout } from "@/pages/_app";
import { useGetUserInvoices } from "@/reactQuery/useInvoices";
import { useGetUserSubscriptions } from "@/reactQuery/useSubscriptions";
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

const SubscriptionsPage: NextPageWithLayout = () => {
  const subscriptions = useGetUserSubscriptions();
  const invoices = useGetUserInvoices();


  return (
    <Container maxWidth="md" sx={{ paddingY: 3 }}>
      <PageHeading title="Subscriptions" />

      <PageSection
        isTop
        title="Customer balance"
        body={
          <CustomerBalanceDetail sx={{ paddingX: 2 }} />
        }
      />

      <PageSection
        title="Subscriptions"
        body={
          <SubscriptionsList
            query={subscriptions}
            visible={6}
          />
        }
      />

      <PageSection
        title="Invoice history"
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

SubscriptionsPage.layoutProps = {
  title: "Subscriptions",
  footerProps: {
    adSlot: "7020400075",
  },
};


export default SubscriptionsPage;