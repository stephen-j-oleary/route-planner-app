import { useQuery } from "react-query";

import { getRouteById } from "@/services/routes";

const BASE_KEY = "routes";


export function useGetRouteById(id, options = {}) {
  return useQuery({
    queryKey: [BASE_KEY, { id }],
    queryFn: () => getRouteById(id),
    ...options,
  });
}