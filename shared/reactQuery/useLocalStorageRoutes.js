import { useMutation, useQuery, useQueryClient } from "react-query";

import { createLocalStorageRoute, getLocalStorageRouteById, getLocalStorageRoutes, getLocalStorageRoutesByUser } from "@/shared/services/localStorageRoutes";

const BASE_KEY = "localStorageRoutes";


export function useGetLocalStorageRoutes(options = {}) {
  return useQuery({
    queryKey: [BASE_KEY],
    queryFn: () => getLocalStorageRoutes(),
    ...options,
  });
}

export function useGetLocalStorageRoutesByUser(user, options = {}) {
  return useQuery({
    queryKey: [BASE_KEY, { user }],
    queryFn: () => getLocalStorageRoutesByUser(user),
    ...options,
  });
}

export function useGetLocalStorageRouteById(id, options = {}) {
  return useQuery({
    queryKey: [BASE_KEY, { id }],
    queryFn: () => getLocalStorageRouteById(id),
    ...options,
  });
}

export function useCreateLocalStorageRoute() {
  const queryClient = useQueryClient();

  return useMutation(
    data => createLocalStorageRoute(data),
    {
      onSuccess() {
        queryClient.invalidateQueries([BASE_KEY]);
      },
    }
  );
}