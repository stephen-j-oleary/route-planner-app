import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";

import { createUserCheckoutSession, CreateUserCheckoutSessionData } from "@/services/checkoutSessions";


export function useCreateUserCheckoutSession() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateUserCheckoutSessionData) => {
      const defaultData = data?.ui_mode === "embedded"
        ? { return_url: router.asPath }
        : { cancel_url: router.asPath };

      return createUserCheckoutSession({
        ...defaultData,
        ...data
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries("subscriptions");
    },
  })
}