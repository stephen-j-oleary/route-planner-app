import { useMutation, useQueryClient } from "react-query";

import { verifyUser, verifyUserSend } from "@/services/verify";


export function useVerifyUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    }
  });
}

export function useVerifyUserSend() {
  return useMutation({
    mutationFn: verifyUserSend,
  });
}