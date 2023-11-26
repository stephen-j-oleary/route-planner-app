import { useMutation, useQuery, useQueryClient } from "react-query";

import { deleteUserById, getUserById, GetUserByIdParams, updateUserById } from "@/shared/services/users";

const BASE_KEY = "users";


type UseGetUserByIdDefaultType = Awaited<ReturnType<typeof getUserById>>;
export type UseGetUserByIdOptions<TData = UseGetUserByIdDefaultType> = {
  enabled?: boolean,
  select?: (data: UseGetUserByIdDefaultType) => TData,
  params?: GetUserByIdParams,
};

export function useGetUserById<TData = UseGetUserByIdDefaultType>(id?: string, { params = {}, enabled = !!id, ...options }: UseGetUserByIdOptions<TData> = {}) {
  return useQuery({
    ...options,
    enabled,
    queryKey: [BASE_KEY, id, params],
    queryFn: () => getUserById(id, params),
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