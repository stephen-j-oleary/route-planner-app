import { useMutation, useQuery, useQueryClient } from "react-query";

import { createDatabaseRoute, deleteDatabaseRouteById, getDatabaseRouteById, getDatabaseRoutes } from "@/shared/services/databaseRoutes";

const BASE_KEY = "databaseRoutes";


export function useGetDatabaseRoutes(options = {}) {
  return useQuery({
    queryKey: [BASE_KEY],
    queryFn: () => getDatabaseRoutes(),
    ...options,
  });
}

export function useGetDatabaseRouteById(id, options = {}) {
  return useQuery({
    queryKey: [BASE_KEY, { id }],
    queryFn: () => getDatabaseRouteById(id),
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

  return useMutation(
    id => deleteDatabaseRouteById(id),
    {
      onSuccess() {
        queryClient.invalidateQueries([BASE_KEY]);
      },
    }
  );
}