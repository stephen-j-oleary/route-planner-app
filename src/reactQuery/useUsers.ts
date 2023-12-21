import { useMutation, useQuery, useQueryClient } from "react-query";

import { deleteUserById, getUserById, GetUserByIdParams, GetUserByIdReturn, updateUserById } from "@/services/users";

const BASE_KEY = "users";


export type UseGetUserByIdOptions<TData, TSelected> = {
  enabled?: boolean,
  select?: (data: TData) => TSelected,
  params?: GetUserByIdParams,
};

export function useGetUserById<TData = Awaited<GetUserByIdReturn>, TSelected = TData>(id?: string, { params = {}, enabled = true, ...options }: UseGetUserByIdOptions<TData, TSelected> = {}) {
  return useQuery({
    queryKey: [BASE_KEY, id, params],
    queryFn: () => getUserById(id, params) as TData,
    enabled: enabled && !!id,
    ...options,
  });
}

export function useUpdateUserById() {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, ...changes }) => updateUserById(id, changes),
    {
      onSuccess() {
        queryClient.invalidateQueries(BASE_KEY);
      },
    }
  );
}

export function useDeleteUserById() {
  const queryClient = useQueryClient();

  return useMutation(
    id => deleteUserById(id),
    {
      onSuccess() {
        queryClient.invalidateQueries([BASE_KEY]);
      },
    }
  );
}