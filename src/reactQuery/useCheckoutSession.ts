import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";

import { createCheckoutSession, CreateCheckoutSessionData } from "@/services/checkoutSessions";

export function useCreateCheckoutSession() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn(data: CreateCheckoutSessionData) {
      const defaultData = data?.ui_mode === "embedded"
        ? { return_url: router.asPath }
        : { cancel_url: router.asPath };

      return createCheckoutSession({
        ...defaultData,
        ...data
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries("subscriptions");
    },
  })
}