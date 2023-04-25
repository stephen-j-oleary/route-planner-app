import { useMutation, useQuery, useQueryClient } from "react-query";

import { deleteSubscriptionById, getSubscriptionById, getSubscriptions, getSubscriptionsByCustomer, updateSubscriptionById } from "@/shared/services/subscriptions";

const BASE_KEY = "subscriptions";


export function useGetSubscriptions(options = {}) {
  return useQuery({
    queryKey: [BASE_KEY],
    queryFn: () => getSubscriptions(),
    retry: 1,
    ...options,
  });
}

export function useGetSubscriptionsByCustomer(customer, options = {}) {
  return useQuery({
    queryKey: [BASE_KEY, { customer }],
    queryFn: () => getSubscriptionsByCustomer(customer),
    ...options,
  });
}

export function useGetSubscriptionById(id, options = {}) {
  return useQuery({
    queryKey: [BASE_KEY, { id }],
    queryFn: () => getSubscriptionById(id),
    ...options,
  });
}

export function useUpdateSubscriptionById() {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, ...changes }) => updateSubscriptionById(id, changes),
    {
      onSuccess() {
        queryClient.invalidateQueries([BASE_KEY]);
      },
    }
  );
}

export async function useDeleteSubscriptionById() {
  const queryClient = useQueryClient();

  return useMutation(
    id => deleteSubscriptionById(id),
    {
      onSuccess() {
        queryClient.invalidateQueries([BASE_KEY]);
      },
    }
  );
}