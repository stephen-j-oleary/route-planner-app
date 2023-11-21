import { Container } from "@mui/material";

import AuthGuard from "@/components/AuthGuard";
import DefaultLayout from "@/components/Layouts/Default";
import PageHeading from "@/components/PageHeading";
import SubscriptionForm from "@/components/Subscriptions/Form";


export default function ManageSubscriptionPage() {
  return (
    <AuthGuard>
      <Container maxWidth="md" sx={{ paddingY: 3 }}>
        <PageHeading title="Manage subscriptions" />

        <SubscriptionForm />
      </Container>
    </AuthGuard>
  );
}

ManageSubscriptionPage.getLayout = props => (
  <DefaultLayout
    title="Manage Subscriptions"
    headingComponent="p"
    {...props}
  />
);