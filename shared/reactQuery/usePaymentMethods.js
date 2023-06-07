import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { selectUser, useGetSession } from "@/shared/reactQuery/useSession";
import { createCheckoutSession } from "@/shared/services/checkoutSessions";
import { deletePaymentMethodById, getPaymentMethodById, getPaymentMethodsByCustomer } from "@/shared/services/paymentMethods";

const BASE_KEY = "paymentMethods";


export function useGetPaymentMethodById(id, options = {}) {
  return useQuery({
    queryKey: [BASE_KEY, { id }],
    queryFn: () => getPaymentMethodById(id),
    ...options,
  });
}

export function useGetPaymentMethodsByCustomer(customer, options = {}) {
  return useQuery({
    queryKey: [BASE_KEY, { customer }],
    queryFn: () => getPaymentMethodsByCustomer(customer),
    ...options,
  });
}

export function useCreatePaymentMethod() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const authUser = useGetSession({ select: selectUser });

  return useMutation(
    async () => {
      const { url } = await createCheckoutSession({
        payment_method_types: ["card"],
        mode: "setup",
        success_url: "/account/paymentMethods#create-successful",
        cancel_url: "/account/paymentMethods",
        customer: authUser.data?.customerId || undefined,
        customer_email: (!authUser.data?.customerId && authUser.data?.email) || undefined,
        customer_creation: !authUser.data?.customerId ? "always" : undefined,
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
    id => deletePaymentMethodById(id),
    {
      onSuccess() {
        queryClient.invalidateQueries([BASE_KEY]);
      }
    }
  );
}