import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { deleteUser, getUser, GetUserReturn, updateUser } from "@/services/users";

const BASE_KEY = "users";


export type UseGetUserOptions<TSelected> = {
  enabled?: boolean,
  select?: (data: Awaited<GetUserReturn>) => TSelected,
  retry?: number | boolean,
  retryOnMount?: boolean,
  refetchOnMount?: boolean | "always",
  refetchOnWindowFocus?: boolean | "always",
};

export function useGetUser<TSelected = Awaited<GetUserReturn>>(options: UseGetUserOptions<TSelected> = {}) {
  return useQuery({
    queryKey: [BASE_KEY],
    queryFn: async () => {
      try {
        const data = await getUser();
        return data;
      }
      catch (err) {
        if (err instanceof AxiosError) {
          if (err.response?.status === 401) return null;
          if (err.response?.status === 404) return null;
          throw err.response?.data;
        }
        throw err;
      }
    },
    ...options,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation(
    updateUser,
    {
      onSuccess() {
        queryClient.invalidateQueries(BASE_KEY);
      },
    }
  );
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation(
    deleteUser,
    {
      onSuccess() {
        queryClient.invalidateQueries([BASE_KEY]);
      },
    }
  );
}