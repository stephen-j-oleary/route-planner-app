import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { createCheckoutSession } from "@/services/checkoutSessions";
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


export type UseGetUserPaymentMethodsOptions<TData, TSelected> = {
  params?: GetUserPaymentMethodsParams,
  enabled?: boolean,
  select?: (data: TData) => TSelected,
  onSuccess?: (data?: TSelected) => void,
};

export function useGetUserPaymentMethods<TData = Awaited<GetUserPaymentMethodsReturn>, TSelected = TData>({ params, ...options }: UseGetUserPaymentMethodsOptions<TData, TSelected> = {}) {
  return useQuery({
    queryKey: [BASE_KEY, params],
    queryFn: () => getUserPaymentMethods(params) as TData,
    ...options,
  });
}


export function useCreatePaymentMethod() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    async () => {
      const { url } = await createCheckoutSession({
        payment_method_types: ["card"],
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