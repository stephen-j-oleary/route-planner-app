import { useQuery } from "react-query";

import { getUsageRecords, getUsageRecordsBySubscriptionItem } from "@/shared/services/usageRecords";

const BASE_KEY = "usageRecords";


export function useGetUsageRecords(options = {}) {
  return useQuery({
    queryKey: [BASE_KEY],
    queryFn: () => getUsageRecords(),
    ...options,
  });
}

export function useGetUsageRecordsBySubscriptionItem(subscriptionItem, options = {}) {
  return useQuery({
    queryKey: [BASE_KEY, { subscriptionItem }],
    queryFn: () => getUsageRecordsBySubscriptionItem(subscriptionItem),
    ...options,
  });
}