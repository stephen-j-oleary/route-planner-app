import mongoose from "mongoose";
import { useMutation, UseMutationOptions, useQuery, useQueryClient } from "react-query";

import { IAccount } from "@/shared/models/Account";
import { deleteAccountById, deleteAccountByUser, getAccounts, GetAccountsReturn, updateAccountCredentialsById, UpdateAccountCredentialsByIdData, UpdateAccountCredentialsByIdReturn } from "@/shared/services/accounts";

const BASE_KEY = "accounts";


export const selectCredentialAccount = (data?: mongoose.FlattenMaps<IAccount>[]) => data?.find(item => item.provider === "credentials");

export type UseGetAccountsOptions<TData, TSelected> = {
  enabled?: boolean,
  select?: (data: TData) => TSelected,
}
export function useGetAccounts<TData = Awaited<GetAccountsReturn>, TSelected = TData>(options: UseGetAccountsOptions<TData, TSelected> = {}) {
  return useQuery({
    queryKey: [BASE_KEY],
    queryFn: () => getAccounts() as TData,
    ...options,
  });
}

type UseUpdateAccountCredentialsByIdVariables = { id: string } & UpdateAccountCredentialsByIdData;
export type UseUpdateAccountCredentialsByIdOptions = {
  onSuccess?: (data: Awaited<UpdateAccountCredentialsByIdReturn>, variables: UseUpdateAccountCredentialsByIdVariables, context: unknown) => void,
}

export function useUpdateAccountCredentialsById({ onSuccess, ...options }: UseUpdateAccountCredentialsByIdOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...changes }: UseUpdateAccountCredentialsByIdVariables) => updateAccountCredentialsById(id, changes),
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries(BASE_KEY);
      onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

export type UseDeleteAccountByIdOptions = Omit<UseMutationOptions<unknown, unknown, string, unknown>, "mutationFn">;

export function useDeleteAccountById({ onSuccess, ...options }: UseDeleteAccountByIdOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAccountById(id),
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries([BASE_KEY]);
      onSuccess?.(data, variables, context);
    },
    ...options,
  });
}


export type UseDeleteAccountByUserOptions = Omit<UseMutationOptions<unknown, unknown, string, unknown>, "mutationFn">;
export function useDeleteAccountByUser({ onSuccess, ...options }: UseDeleteAccountByUserOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deleteAccountByUser(userId),
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries(BASE_KEY);
      onSuccess?.(data, variables, context);
    },
    ...options,
  });
}