import { Container } from "@mui/material";

import AuthGuard from "@/components/AuthGuard";
import ErrorBoundary from "@/components/ErrorBoundary";
import DefaultLayout from "@/components/Layouts/Default";
import PageHeading from "@/components/PageHeading";
import SubscriptionItemsList from "@/components/Subscriptions/Items/List";
import useRouterQuery from "@/shared/hooks/useRouterQuery";
import { useGetSubscriptionItemsBySubscription } from "@/shared/reactQuery/useSubscriptionItems";


export default function SubscriptionItemsPage() {
  const query = useRouterQuery();
  const subscriptionId = query.get("subscriptionId");

  const subscriptionItems = useGetSubscriptionItemsBySubscription(
    subscriptionId,
    { enabled: query.isReady }
  );


  return (
    <ErrorBoundary>
      <AuthGuard>
        <Container maxWidth="md" sx={{ paddingY: 3 }}>
          <PageHeading title="Subscription Items" />

          <SubscriptionItemsList
            loading={subscriptionItems.isIdle || subscriptionItems.isLoading}
            error={subscriptionItems.isError}
            data={
              subscriptionItems.isSuccess
                ? subscriptionItems.data
                : []
            }
          />
        </Container>
      </AuthGuard>
    </ErrorBoundary>
  );
}

SubscriptionItemsPage.getLayout = props => (
  <DefaultLayout
    title="Subscription Items"
    headingComponent="p"
    {...props}
  />
);