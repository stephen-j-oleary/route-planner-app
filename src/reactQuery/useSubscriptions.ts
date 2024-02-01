import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { cancelUserSubscriptionById, getUserSubscriptionById, GetUserSubscriptionByIdReturn, getUserSubscriptions, GetUserSubscriptionsParams, GetUserSubscriptionsReturn, updateUserSubscriptionById, UpdateUserSubscriptionByIdData } from "@/services/subscriptions";

const BASE_KEY = "subscriptions";


export type UseGetUserSubscriptionsOptions<TData = Awaited<GetUserSubscriptionsReturn>> = {
  enabled?: boolean,
  select?: (data: Awaited<GetUserSubscriptionsReturn>) => TData,
  onSuccess?: (data?: TData) => void,
  params?: GetUserSubscriptionsParams,
};

export function useGetUserSubscriptions<TData = Awaited<GetUserSubscriptionsReturn>>({ params, ...options }: UseGetUserSubscriptionsOptions<TData> = {}) {
  return useQuery({
    queryKey: [BASE_KEY, params],
    queryFn: async () => {
      try {
        const data = await getUserSubscriptions(params);
        return data;
      }
      catch (err: unknown) {
        if (err instanceof AxiosError) {
          if (err.response?.status === 401) return [];
          throw err.response?.data;
        }
        throw err;
      }
    },
    ...options,
  });
}


export type UseGetUserSubscriptionByIdOptions<TData = Awaited<GetUserSubscriptionByIdReturn>> = {
  enabled?: boolean,
  select?: (data: Awaited<GetUserSubscriptionByIdReturn>) => TData,
};

export function useGetUserSubscriptionById<TData = Awaited<GetUserSubscriptionByIdReturn>>(id: string | undefined, { enabled = true, ...options }: UseGetUserSubscriptionByIdOptions<TData> = {}) {
  return useQuery({
    enabled: enabled && !!id,
    queryKey: [BASE_KEY, { id }],
    queryFn: () => getUserSubscriptionById(id),
    ...options,
  });
}


export function useUpdateUserSubscriptionById() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...changes }: { id: string } & UpdateUserSubscriptionByIdData) => updateUserSubscriptionById(id, changes),
    onSuccess: () => void queryClient.invalidateQueries([BASE_KEY]),
  });
}


export function useCancelUserSubscriptionById() {
  const queryClient = useQueryClient();

  return useMutation(
    {
      mutationFn: cancelUserSubscriptionById,
      onSuccess: () => void queryClient.invalidateQueries([BASE_KEY]),
    }
  );
}


export function useCancelUserSubscriptionAtPeriodEndById() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => updateUserSubscriptionById(id, { cancel_at_period_end: true }),
    onSuccess: () => void queryClient.invalidateQueries([BASE_KEY]),
  });
}