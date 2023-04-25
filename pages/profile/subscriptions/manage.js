import { Container } from "@mui/material";

import AuthGuard from "@/components/AuthGuard";
import ErrorBoundary from "@/components/ErrorBoundary";
import DefaultLayout from "@/components/Layouts/Default";
import PageHeading from "@/components/PageHeading";
import SubscriptionForm from "@/components/Subscriptions/Form";


export default function ManageSubscriptionPage() {
  return (
    <ErrorBoundary>
      <AuthGuard>
        <Container maxWidth="md" sx={{ paddingY: 3 }}>
          <PageHeading title="Manage subscriptions" />

          <SubscriptionForm />
        </Container>
      </AuthGuard>
    </ErrorBoundary>
  );
}

ManageSubscriptionPage.getLayout = props => (
  <DefaultLayout
    title="Manage Subscriptions"
    headingComponent="p"
    {...props}
  />
);