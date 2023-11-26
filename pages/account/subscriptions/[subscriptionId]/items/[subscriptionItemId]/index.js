import { Container } from "@mui/material";

import AuthGuard from "@/components/AuthGuard";
import ErrorBoundary from "@/components/ErrorBoundary";
import DefaultLayout from "@/components/Layouts/Default";
import PageHeading from "@/components/PageHeading";
import PageSection from "@/components/PageSection";
import SubscriptionItemDetails from "@/components/Subscriptions/Items/Details";
import UsageRecordsList from "@/components/UsageRecords/List";
import useRouterQuery from "@/shared/hooks/useRouterQuery";
import { useGetSubscriptionItemById } from "@/shared/reactQuery/useSubscriptionItems";
import { useGetUsageRecordsBySubscriptionItem } from "@/shared/reactQuery/useUsageRecords";


export default function SubscriptionItemPage() {
  const query = useRouterQuery();
  const subscriptionId = query.get("subscriptionId");
  const subscriptionItemId = query.get("subscriptionItemId");

  const subscriptionItem = useGetSubscriptionItemById(
    subscriptionItemId,
    { enabled: query.isReady }
  );

  const usageRecords = useGetUsageRecordsBySubscriptionItem(
    subscriptionItemId,
    { enabled: query.isReady }
  );


  return (
    <ErrorBoundary>
      <AuthGuard>
        <Container maxWidth="md" sx={{ paddingY: 3 }}>
          <PageHeading title="Subscription Item" />

          <PageSection
            isTop
            paper
            title="Subscription item details"
            body={
              <SubscriptionItemDetails
                size="small"
                loading={subscriptionItem.isIdle || subscriptionItem.isLoading}
                error={subscriptionItem.isError}
                data={subscriptionItem.isSuccess && subscriptionItem.data}
              />
            }
          />

          <PageSection
            paper
            title="Usage"
            titleHref={`/account/subscriptions/${subscriptionId}/items/${subscriptionItemId}/usage`}
            body={
              <UsageRecordsList
                size="small"
                loading={usageRecords.isIdle || usageRecords.isLoading}
                error={usageRecords.isError}
                data={usageRecords.isSuccess && usageRecords.data}
                visible={3}
              />
            }
          />
        </Container>
      </AuthGuard>
    </ErrorBoundary>
  )
}

SubscriptionItemPage.getLayout = props => (
  <DefaultLayout
    title="Subscription"
    headingComponent="p"
    {...props}
  />
);