import { useMutation, useQuery, useQueryClient } from "react-query";

import { createRoute, deleteRouteById, getRouteById, GetRouteByIdReturn, getRouteLocalById, GetRouteLocalByIdReturn, getRoutes, getRoutesLocal, GetRoutesLocalReturn, GetRoutesReturn } from "@/services/routes";

const BASE_KEY = "routes";
const LOCAL_KEY = `${BASE_KEY}/local`;


export type UseGetRoutesOptions<TData, TSelected> = {
  enabled?: boolean,
  select?: (data: TData) => TSelected,
}

export function useGetRoutes<TData = Awaited<GetRoutesReturn>, TSelected = TData>(options: UseGetRoutesOptions<TData, TSelected> = {}) {
  return useQuery({
    queryKey: [BASE_KEY],
    queryFn: () => getRoutes() as TData,
    ...options,
  });
}

export function useGetRoutesLocal<TData = Awaited<GetRoutesLocalReturn>, TSelected = TData>(options: UseGetRoutesOptions<TData, TSelected> = {}) {
  return useQuery({
    queryKey: [LOCAL_KEY],
    queryFn: () => getRoutesLocal() as TData,
    ...options,
  });
}

export type UseGetRouteByIdOptions<TData, TSelected> = {
  enabled?: boolean,
  select?: (data: TData) => TSelected,
  retry?: boolean | number | ((failureCount: number, error: unknown) => boolean),
}

export function useGetRouteById<TData = Awaited<GetRouteByIdReturn>, TSelected = TData>(id: string | undefined, { enabled = true, ...options }: UseGetRouteByIdOptions<TData, TSelected> = {}) {
  return useQuery({
    queryKey: [BASE_KEY, { id }],
    queryFn: () => getRouteById(id) as TData,
    enabled: !!id && enabled,
    ...options,
  });
}

export function useGetRouteLocalById<TData = Awaited<GetRouteLocalByIdReturn>, TSelected = TData>(id: string | undefined, { enabled = true, ...options }: UseGetRouteByIdOptions<TData, TSelected> = {}) {
  return useQuery({
    queryKey: [LOCAL_KEY, { id }],
    queryFn: () => getRouteLocalById(id) as TData,
    enabled: !!id && enabled,
    ...options,
  });
}

export function useCreateRoute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRoute,
    onSuccess() {
      queryClient.invalidateQueries([BASE_KEY]);
    },
  });
}

export function useDeleteRoute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRouteById(id),
    onSuccess() {
      queryClient.invalidateQueries([BASE_KEY]);
    },
  });
}