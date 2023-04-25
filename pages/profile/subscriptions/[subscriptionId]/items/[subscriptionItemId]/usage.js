import { Container } from "@mui/material";

import AuthGuard from "@/components/AuthGuard";
import ErrorBoundary from "@/components/ErrorBoundary";
import DefaultLayout from "@/components/Layouts/Default";
import PageHeading from "@/components/PageHeading";
import UsageRecordsList from "@/components/UsageRecords/List";
import useRouterQuery from "@/shared/hooks/useRouterQuery";
import { useGetUsageRecordsBySubscriptionItem } from "@/shared/reactQuery/useUsageRecords";


export default function SubscriptionItemUsagePage() {
  const query = useRouterQuery();
  const subscriptionItem = query.get("subscriptionItemId");

  const usageRecords = useGetUsageRecordsBySubscriptionItem(
    subscriptionItem,
    { enabled: query.isReady }
  );


  return (
    <ErrorBoundary>
      <AuthGuard>
        <Container maxWidth="sm" sx={{ paddingY: 3 }}>
          <PageHeading title="Subscription Usage" />

          <UsageRecordsList
            loading={usageRecords.isIdle || usageRecords.isLoading}
            error={usageRecords.isError}
            data={usageRecords.isSuccess && usageRecords.data}
          />
        </Container>
      </AuthGuard>
    </ErrorBoundary>
  );
}

SubscriptionItemUsagePage.getlayout = props => (
  <DefaultLayout
    title="Subscription Item Usage"
    headingComponent="p"
    {...props}
  />
);