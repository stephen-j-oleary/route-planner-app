import { useMutation, useQuery, useQueryClient } from "react-query";

import { createUserRoute, deleteUserRouteById, getLocalRouteById, GetLocalRouteByIdReturn, getLocalRoutes, GetLocalRoutesReturn, getUserRouteById, GetUserRouteByIdReturn, getUserRoutes, GetUserRoutesReturn } from "@/services/routes";

const BASE_KEY = "routes";
const LOCAL_KEY = `${BASE_KEY}/local`;


export type UseGetUserRoutesOptions<TData, TSelected> = {
  enabled?: boolean,
  select?: (data: TData) => TSelected,
}

export function useGetUserRoutes<TData = Awaited<GetUserRoutesReturn>, TSelected = TData>(options: UseGetUserRoutesOptions<TData, TSelected> = {}) {
  return useQuery({
    queryKey: [BASE_KEY],
    queryFn: () => getUserRoutes() as TData,
    ...options,
  });
}

export function useGetLocalRoutes<TData = Awaited<GetLocalRoutesReturn>, TSelected = TData>(options: UseGetUserRoutesOptions<TData, TSelected> = {}) {
  return useQuery({
    queryKey: [LOCAL_KEY],
    queryFn: () => getLocalRoutes() as TData,
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