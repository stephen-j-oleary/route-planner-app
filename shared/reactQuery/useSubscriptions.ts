import { useMutation, useQuery, useQueryClient } from "react-query";

import { cancelSubscriptionById, createSubscription, CreateSubscriptionData, getSubscriptionById, GetSubscriptionByIdParams, GetSubscriptionByIdReturn, getSubscriptions, GetSubscriptionsParams, GetSubscriptionsReturn, updateSubscriptionById, UpdateSubscriptionByIdData } from "@/shared/services/subscriptions";

const BASE_KEY = "subscriptions";

export type UseGetSubscriptionsOptions<TData = Awaited<GetSubscriptionsReturn>> = {
  enabled?: boolean,
  select?: (data: Awaited<GetSubscriptionsReturn>) => TData,
  onSuccess?: (data?: TData) => void,
  params?: GetSubscriptionsParams,
};

export function useGetSubscriptions<TData = Awaited<GetSubscriptionsReturn>>({ params, ...options }: UseGetSubscriptionsOptions<TData> = {}) {
  return useQuery({
    queryKey: [BASE_KEY, params],
    queryFn: () => getSubscriptions(params),
    ...options,
  });
}

export type UseGetSubscriptionByIdOptions<TData = Awaited<GetSubscriptionByIdReturn>> = {
  enabled?: boolean,
  select?: (data: Awaited<GetSubscriptionByIdReturn>) => TData,
  params?: GetSubscriptionByIdParams,
};

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
    mutationFn: (data: CreateSubscriptionData) => createSubscription(data),
    onSuccess: () => void queryClient.invalidateQueries([BASE_KEY]),
  });
}

export function useUpdateSubscriptionById() {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, ...changes }: { id: string } & UpdateSubscriptionByIdData) => updateSubscriptionById(id, changes),
    {
      onSuccess: () => void queryClient.invalidateQueries([BASE_KEY]),
    }
  );
}

export function useCancelSubscriptionById() {
  const queryClient = useQueryClient();

  return useMutation(
    {
      mutationFn: (id: string) => cancelSubscriptionById(id),
      onSuccess: () => void queryClient.invalidateQueries([BASE_KEY]),
    }
  );
}

export function useCancelSubscriptionAtPeriodEndById() {
  const queryClient = useQueryClient();

  return useMutation(
    {
      mutationFn: (id: string) => updateSubscriptionById(id, { cancel_at_period_end: true }),
      onSuccess: () => void queryClient.invalidateQueries([BASE_KEY]),
    }
  );
}