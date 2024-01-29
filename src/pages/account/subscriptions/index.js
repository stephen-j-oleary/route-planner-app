import { Container } from "@mui/material";

import CustomerBalanceDetail from "@/components/CustomerBalanceDetail";
import InvoicesList from "@/components/Invoices/List";
import SubscriptionsList from "@/components/Subscriptions/List";
import AuthGuard from "@/components/ui/AuthGuard";
import DefaultLayout from "@/components/ui/Layouts/Default";
import PageHeading from "@/components/ui/PageHeading";
import PageSection from "@/components/ui/PageSection";
import { useGetUserInvoices } from "@/reactQuery/useInvoices";
import { useGetUserSubscriptions } from "@/reactQuery/useSubscriptions";


export default function SubscriptionsPage() {
  const subscriptions = useGetUserSubscriptions();
  const invoices = useGetUserInvoices();


  return (
    <AuthGuard>
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
    </AuthGuard>
  );
}

SubscriptionsPage.getLayout = props => (
  <DefaultLayout
    title="Subscriptions"
    headingComponent="p"
    {...props}
  />
);