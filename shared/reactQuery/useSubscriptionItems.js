import { useQuery } from "react-query";

import { getSubscriptionItemById, getSubscriptionItemsBySubscription } from "@/shared/services/subscriptionItems";

const BASE_KEY = "subscriptionItems";


export function useGetSubscriptionItemsBySubscription(subscription, options = {}) {
  return useQuery({
    queryKey: [BASE_KEY, { subscription }],
    queryFn: () => getSubscriptionItemsBySubscription(subscription),
    ...options,
  });
}

export function useGetSubscriptionItemById(id, options = {}) {
  return useQuery({
    queryKey: [BASE_KEY, { id }],
    queryFn: () => getSubscriptionItemById(id),
    ...options,
  });
}