import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { createUserRoute, deleteUserRouteById, getLocalRouteById, GetLocalRouteByIdReturn, getLocalRoutes, GetLocalRoutesReturn, getUserRouteById, GetUserRouteByIdReturn, getUserRoutes, GetUserRoutesReturn } from "@/services/routes";

const BASE_KEY = "routes";
const LOCAL_KEY = `${BASE_KEY}/local`;


export type UseGetUserRoutesOptions<TSelected> = {
  enabled?: boolean,
  select?: (data: Awaited<GetUserRoutesReturn>) => TSelected,
}

export function useGetUserRoutes<TSelected = Awaited<GetUserRoutesReturn>>(options: UseGetUserRoutesOptions<TSelected> = {}) {
  return useQuery({
    queryKey: [BASE_KEY],
    queryFn: async () => {
      try {
        const data = await getUserRoutes();
        return data;
      }
      catch (err) {
        if (err instanceof AxiosError) {
          if (err.response?.status === 401) return [];
          throw err.response?.data;
        }
        throw err;
      }
    },
    ...options,
  });
}

export function useGetLocalRoutes<TSelected = Awaited<GetLocalRoutesReturn>>(options: UseGetUserRoutesOptions<TSelected> = {}) {
  return useQuery({
    queryKey: [LOCAL_KEY],
    queryFn: () => getLocalRoutes(),
    ...options,
  });
}

export type UseGetUserRouteByIdOptions<TData, TSelected> = {
  enabled?: boolean,
  select?: (data: TData) => TSelected,
  retry?: boolean | number | ((failureCount: number, error: unknown) => boolean),
}

export function useGetUserRouteById<TData = Awaited<GetUserRouteByIdReturn>, TSelected = TData>(id: string | undefined, { enabled = true, ...options }: UseGetUserRouteByIdOptions<TData, TSelected> = {}) {
  return useQuery({
    queryKey: [BASE_KEY, { id }],
    queryFn: () => getUserRouteById(id) as TData,
    enabled: !!id && enabled,
    ...options,
  });
}

export function useGetLocalRouteById<TData = Awaited<GetLocalRouteByIdReturn>, TSelected = TData>(id: string | undefined, { enabled = true, ...options }: UseGetUserRouteByIdOptions<TData, TSelected> = {}) {
  return useQuery({
    queryKey: [LOCAL_KEY, { id }],
    queryFn: () => getLocalRouteById(id) as TData,
    enabled: !!id && enabled,
    ...options,
  });
}

export function useCreateUserRoute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUserRoute,
    onSuccess() {
      queryClient.invalidateQueries([BASE_KEY]);
    },
  });
}

export function useDeleteUserRouteById() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUserRouteById(id),
    onSuccess() {
      queryClient.invalidateQueries([BASE_KEY]);
    },
  });
}