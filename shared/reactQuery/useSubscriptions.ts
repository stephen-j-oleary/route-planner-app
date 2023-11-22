import { useMutation, useQuery, useQueryClient } from "react-query";

import { cancelSubscriptionById, createSubscription, getSubscriptionById, GetSubscriptionByIdParams, GetSubscriptionByIdReturn, getSubscriptions, updateSubscriptionById, UpdateSubscriptionByIdData } from "@/shared/services/subscriptions";

const BASE_KEY = "subscriptions";

export type UseGetSubscriptionsOptions<TData = Awaited<ReturnType<typeof getSubscriptions>>> = {
  enabled?: boolean,
  select?: (data: Awaited<ReturnType<typeof getSubscriptions>>) => TData,
  onSuccess?: (data?: TData) => void,
};
export function useGetSubscriptions<TData = Awaited<ReturnType<typeof getSubscriptions>>>(options: UseGetSubscriptionsOptions<TData> = {}) {
  return useQuery({
    queryKey: [BASE_KEY],
    queryFn: () => getSubscriptions(),
    ...options,
  });
}

export type UseGetSubscriptionByIdOptions<TData = Awaited<GetSubscriptionByIdReturn>> = {
  enabled?: boolean,
  select?: (data: Awaited<GetSubscriptionByIdReturn>) => TData,
  params?: GetSubscriptionByIdParams,
}
export function useGetSubscriptionById<TData = Awaited<GetSubscriptionByIdReturn>>(id: string, { params, enabled = true, ...options }: UseGetSubscriptionByIdOptions<TData> = {}) {
  return useQuery({
    enabled: !!(enabled && id),
    queryKey: [BASE_KEY, { id, params }],
    queryFn: () => getSubscriptionById(id, params),
    ...options,
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSubscription,
    onSuccess() {
      queryClient.invalidateQueries([BASE_KEY]);
    },
  });
}

export function useUpdateSubscriptionById() {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, ...changes }: { id: string } & UpdateSubscriptionByIdData) => updateSubscriptionById(id, changes),
    {
      onSuccess() {
        queryClient.invalidateQueries([BASE_KEY]);
      },
    }
  );
}

export function useCancelSubscriptionById() {
  const queryClient = useQueryClient();

  return useMutation(
    {
      mutationFn(id: string) {
        return cancelSubscriptionById(id);
      },
      onSuccess() {
        queryClient.invalidateQueries([BASE_KEY]);
      },
    }
  );
}

export function useCancelSubscriptionAtPeriodEndById() {
  const queryClient = useQueryClient();

  return useMutation(
    {
      mutationFn(id: string) {
        return updateSubscriptionById(
          id,
          { cancel_at_period_end: true }
        );
      },
      onSuccess() {
        queryClient.invalidateQueries([BASE_KEY]);
      }
    }
  )
}