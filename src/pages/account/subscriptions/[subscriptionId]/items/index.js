import { isArray } from "lodash";

import { Container } from "@mui/material";

import SubscriptionItemsList from "@/components/Subscriptions/Items/List";
import AuthGuard from "@/components/ui/AuthGuard";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import DefaultLayout from "@/components/ui/Layouts/Default";
import PageHeading from "@/components/ui/PageHeading";
import useRouterQuery from "@/hooks/useRouterQuery";
import { useGetSubscriptionItemsBySubscription } from "@/reactQuery/useSubscriptionItems";


export default function SubscriptionItemsPage() {
  const query = useRouterQuery();
  let subscriptionId = query.get("subscriptionId");
  if (isArray(subscriptionId)) subscriptionId = subscriptionId[0];

  const subscriptionItems = useGetSubscriptionItemsBySubscription(subscriptionId);


  return (
    <ErrorBoundary>
      <AuthGuard>
        <Container maxWidth="md" sx={{ paddingY: 3 }}>
          <PageHeading title="Subscription Items" />

          <SubscriptionItemsList
            query={subscriptionItems}
            visible={6}
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