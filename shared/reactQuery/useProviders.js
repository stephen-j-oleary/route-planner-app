import { getProviders } from "next-auth/react";
import { useQuery } from "react-query";

const BASE_KEY = "providers";


/**
 * @param {Omit<import("react-query").UseQueryOptions, "queryKey"|"queryFn">} options
 * @returns {import("react-query").UseQueryResult}
 */
export function useGetProviders(options = {}) {
  return useQuery({
    queryKey: [BASE_KEY],
    queryFn: () => getProviders(),
    ...options,
  });
}