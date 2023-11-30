import { Container } from "@mui/material";

import AuthGuard from "@/components/AuthGuard";
import InvoicesList from "@/components/Invoices/List";
import DefaultLayout from "@/components/Layouts/Default";
import PageHeading from "@/components/PageHeading";
import PageSection from "@/components/PageSection";
import SubscriptionsList from "@/components/Subscriptions/List";
import { useGetInvoices } from "@/shared/reactQuery/useInvoices";
import { selectUser, useGetSession } from "@/shared/reactQuery/useSession";
import { useGetSubscriptions } from "@/shared/reactQuery/useSubscriptions";


export default function SubscriptionsPage() {
  const authUser = useGetSession({ select: selectUser });

  const subscriptions = useGetSubscriptions({
    enabled: !!authUser.data?.customerId,
  });

  const invoices = useGetInvoices({
    enabled: authUser.isSuccess,
    select: data => data.filter(item => item.customer === authUser.data?.customerId),
  });


  return (
    <AuthGuard>
      <Container maxWidth="md" sx={{ paddingY: 3 }}>
        <PageHeading title="Subscriptions" />

        <PageSection
          top
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