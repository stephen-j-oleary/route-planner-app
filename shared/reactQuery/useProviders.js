import { getProviders } from "next-auth/react";
import { useQuery } from "react-query";

const BASE_KEY = "providers";


export function useGetProviders(options = {}) {
  return useQuery({
    queryKey: [BASE_KEY],
    queryFn: () => getProviders(),
    ...options,
  });
}