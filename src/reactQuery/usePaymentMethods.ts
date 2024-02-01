import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { createUserCheckoutSession } from "@/services/checkoutSessions";
import { deleteUserPaymentMethodById, getUserPaymentMethodById, GetUserPaymentMethodByIdReturn, getUserPaymentMethods, GetUserPaymentMethodsParams, GetUserPaymentMethodsReturn } from "@/services/paymentMethods";

const BASE_KEY = "paymentMethods";


export type UseGetUserPaymentMethodByIdOptions<TData, TSelected> = {
  enabled?: boolean,
  select?: (data: TData) => TSelected,
  onSuccess?: (data?: TSelected) => void,
};

export function useGetUserPaymentMethodById<TData = Awaited<GetUserPaymentMethodByIdReturn>, TSelected = TData>(id: string | undefined, { enabled = true, ...options }: UseGetUserPaymentMethodByIdOptions<TData, TSelected> = {}) {
  return useQuery({
    queryKey: [BASE_KEY, id],
    queryFn: () => getUserPaymentMethodById(id) as TData,
    enabled: !!id && enabled,
    ...options,
  });
}


export type UseGetUserPaymentMethodsOptions<TSelected> = {
  params?: GetUserPaymentMethodsParams,
  enabled?: boolean,
  select?: (data: Awaited<GetUserPaymentMethodsReturn>) => TSelected,
  onSuccess?: (data?: TSelected) => void,
};

export function useGetUserPaymentMethods<TSelected = Awaited<GetUserPaymentMethodsReturn>>({ params, ...options }: UseGetUserPaymentMethodsOptions<TSelected> = {}) {
  return useQuery({
    queryKey: [BASE_KEY, params],
    queryFn: async () => {
      try {
        const data = await getUserPaymentMethods(params);
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


export function useCreateUserPaymentMethod() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    async () => {
      const { url } = await createUserCheckoutSession({
        mode: "setup",
        success_url: "/account/paymentMethods#create-successful",
        cancel_url: "/account/paymentMethods",
      });

      if (!url) throw new Error("Error generating card setup session");

      router.push(url);
    },
    {
      onSuccess() {
        queryClient.invalidateQueries([BASE_KEY]);
      }
    }
  );
}


export function useDeleteUserPaymentMethodById() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserPaymentMethodById,
    onSuccess() {
      queryClient.invalidateQueries([BASE_KEY]);
    }
  });
}