import { useMutation, useQuery, useQueryClient } from "react-query";

import { deleteUser, getUser, GetUserReturn, updateUser } from "@/services/users";

const BASE_KEY = "users";


export type UseGetUserOptions<TData, TSelected> = {
  enabled?: boolean,
  select?: (data: TData) => TSelected,
};

export function useGetUser<TData = Awaited<GetUserReturn>, TSelected = TData>(options: UseGetUserOptions<TData, TSelected> = {}) {
  return useQuery({
    queryKey: [BASE_KEY],
    queryFn: () => getUser() as TData,
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