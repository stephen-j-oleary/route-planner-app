import { useMutation, useQuery, useQueryClient } from "react-query";

import { createDatabaseRoute, deleteDatabaseRouteById, getDatabaseRouteById, getDatabaseRoutes } from "@/services/databaseRoutes";

const BASE_KEY = "databaseRoutes";


export function useGetDatabaseRoutes(options = {}) {
  return useQuery({
    queryKey: [BASE_KEY],
    queryFn: () => getDatabaseRoutes(),
    ...options,
  });
}

export type UseGetDatabaseRouteByIdOptions = {
  enabled?: boolean,
}

export function useGetDatabaseRouteById(id: string | undefined, { enabled = true, ...options }: UseGetDatabaseRouteByIdOptions = {}) {
  return useQuery({
    queryKey: [BASE_KEY, { id }],
    queryFn: () => getDatabaseRouteById(id),
    enabled: !!id && enabled,
    ...options,
  });
}

export function useCreateDatabaseRoute() {
  const queryClient = useQueryClient();

  return useMutation(
    data => createDatabaseRoute(data),
    {
      onSuccess() {
        queryClient.invalidateQueries([BASE_KEY]);
      },
    }
  );
}

export function useDeleteDatabaseRoute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDatabaseRouteById(id),
    onSuccess() {
      queryClient.invalidateQueries([BASE_KEY]);
    },
  });
}