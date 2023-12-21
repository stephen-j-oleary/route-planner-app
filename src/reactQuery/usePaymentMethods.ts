import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { createCheckoutSession } from "@/services/checkoutSessions";
import { deletePaymentMethodById, getPaymentMethodById, GetPaymentMethodByIdReturn, getPaymentMethods, GetPaymentMethodsParams, GetPaymentMethodsReturn } from "@/services/paymentMethods";

const BASE_KEY = "paymentMethods";

export type UseGetPaymentMethodByIdOptions<TData = Awaited<GetPaymentMethodByIdReturn>> = {
  enabled?: boolean,
  select?: (data: Awaited<GetPaymentMethodByIdReturn>) => TData,
  onSuccess?: (data?: TData) => void,
}
export function useGetPaymentMethodById<TData = Awaited<GetPaymentMethodByIdReturn>>(id: string, options: UseGetPaymentMethodByIdOptions<TData> = {}) {
  return useQuery({
    queryKey: [BASE_KEY, id],
    queryFn: () => getPaymentMethodById(id),
    ...options,
  });
}

export type UseGetPaymentMethodsOptions<TData = Awaited<GetPaymentMethodsReturn>> = {
  enabled?: boolean,
  select?: (data: Awaited<GetPaymentMethodsReturn>) => TData,
  onSuccess?: (data?: TData) => void,
  params?: GetPaymentMethodsParams,
}
export function useGetPaymentMethods<TData = Awaited<GetPaymentMethodsReturn>>({ params, ...options }: UseGetPaymentMethodsOptions<TData> = {}) {
  return useQuery({
    queryKey: [BASE_KEY, params],
    queryFn: () => getPaymentMethods(params),
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

export function useDeletePaymentMethodById() {
  const queryClient = useQueryClient();

  return useMutation(
    (id: string) => deletePaymentMethodById(id),
    {
      onSuccess() {
        queryClient.invalidateQueries([BASE_KEY]);
      }
    }
  );
}