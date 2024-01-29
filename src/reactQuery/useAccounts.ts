import mongoose from "mongoose";
import { useMutation, UseMutationOptions, useQuery, useQueryClient } from "react-query";

import { IAccount } from "@/models/Account";
import { deleteUserAccountById, getUserAccounts, GetUserAccountsReturn, updateUserAccountById, UpdateUserAccountByIdData, UpdateUserAccountByIdReturn } from "@/services/accounts";

const BASE_KEY = "accounts";


export const selectCredentialAccount = (data?: mongoose.FlattenMaps<IAccount>[]) => data?.find(item => item.provider === "credentials");


export type UseGetUserAccountsOptions<TData, TSelected> = {
  enabled?: boolean,
  select?: (data: TData) => TSelected,
};

export function useGetUserAccounts<TData = Awaited<GetUserAccountsReturn>, TSelected = TData>(options: UseGetUserAccountsOptions<TData, TSelected> = {}) {
  return useQuery({
    queryKey: [BASE_KEY],
    queryFn: () => getUserAccounts() as TData,
    ...options,
  });
}

type UseUpdateUserAccountByIdVariables = { id: string } & UpdateUserAccountByIdData;
export type UseUpdateUserAccountByIdOptions = {
  onSuccess?: (data: Awaited<UpdateUserAccountByIdReturn>, variables: UseUpdateUserAccountByIdVariables, context: unknown) => void,
};

export function useUpdateUserAccountById({ onSuccess, ...options }: UseUpdateUserAccountByIdOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...changes }: UseUpdateUserAccountByIdVariables) => updateUserAccountById(id, changes),
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries(BASE_KEY);
      onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

export type UseDeleteUserAccountByIdOptions = Omit<UseMutationOptions<unknown, unknown, string, unknown>, "mutationFn">;

export function useDeleteUserAccountById({ onSuccess, ...options }: UseDeleteUserAccountByIdOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserAccountById,
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries([BASE_KEY]);
      onSuccess?.(data, variables, context);
    },
    ...options,
  });
}