import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { getVerify, verifyUser, verifyUserResend } from "@/services/verify";

const BASE_KEY = "verify";


export function useGetVerify() {
  return useQuery({
    queryKey: [BASE_KEY],
    queryFn: async () => {
      try {
        const data = await getVerify();
        return data;
      }
      catch (err) {
        if (err instanceof AxiosError) {
          if (err.response?.status === 401) return null;
          if (err.response?.status === 404) return null;
          throw err.response?.data;
        }
        throw err;
      }
    }
  })
}

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