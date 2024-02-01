import { getProviders } from "next-auth/react";
import { useQuery } from "react-query";

const BASE_KEY = "providers";


export type UseGetProvidersOptions<TData, TSelected> = {
  enabled?: boolean,
  select?: (data: TData) => TSelected,
};

export function useGetProviders<TData = Awaited<ReturnType<typeof getProviders>>, TSelected = TData>(options: UseGetProvidersOptions<TData, TSelected> = {}) {
  return useQuery({
    queryKey: [BASE_KEY],
    queryFn: () => getProviders() as TData,
    ...options,
  });
}