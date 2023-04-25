import { Container } from "@mui/material";

import AuthGuard from "@/components/AuthGuard";
import ErrorBoundary from "@/components/ErrorBoundary";
import InvoicesList from "@/components/Invoices/List";
import DefaultLayout from "@/components/Layouts/Default";
import PageHeading from "@/components/PageHeading";
import PageSection from "@/components/PageSection";
import SubscriptionsList from "@/components/Subscriptions/List";
import { useGetInvoices } from "@/shared/reactQuery/useInvoices";
import { selectUser, useGetSession } from "@/shared/reactQuery/useSession";
import { useGetSubscriptionsByCustomer } from "@/shared/reactQuery/useSubscriptions";


export default function SubscriptionsPage() {
  const authUser = useGetSession({ select: selectUser });

  const subscriptions = useGetSubscriptionsByCustomer(
    authUser.data?.customerId,
    { enabled: authUser.isSuccess }
  );

  const invoices = useGetInvoices({
    enabled: authUser.isSuccess,
    select: data => data.filter(item => item.customer === authUser.data?.customerId),
  });


  return (
    <ErrorBoundary>
      <AuthGuard>
        <Container maxWidth="sm" sx={{ paddingY: 3 }}>
          <PageHeading title="Subscriptions" />

          <PageSection
            top
            title="Subscriptions"
            body={
              <SubscriptionsList
                loading={subscriptions.isIdle || subscriptions.isLoading}
                error={subscriptions.isError}
                data={subscriptions.isSuccess && subscriptions.data}
              />
            }
          />

          <PageSection
            paper
            title="Invoice history"
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

SubscriptionsPage.getLayout = props => (
  <DefaultLayout
    title="Subscriptions"
    headingComponent="p"
    {...props}
  />
);