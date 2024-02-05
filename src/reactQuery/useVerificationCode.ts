import { useMutation, useQueryClient } from "react-query";

import { verifyUser, verifyUserResend } from "@/services/verificationCode";


export function useVerifyUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    }
  });
}

export function useVerifyUserResend() {
  return useMutation({
    mutationFn: verifyUserResend,
  });
}