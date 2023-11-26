import { HydratedDocument, LeanDocument } from "mongoose";
import { useMutation, UseMutationOptions, useQuery, useQueryClient } from "react-query";

import { IAccount } from "@/shared/models/Account";
import { deleteAccountById, deleteAccountByUser, getAccounts, GetAccountsReturn, updateAccountCredentialsById } from "@/shared/services/accounts";

const BASE_KEY = "accounts";


export const selectCredentialAccount = (data?: LeanDocument<HydratedDocument<IAccount>>[]) => data?.find(item => item.provider === "credentials");

export type UseGetAccountsOptions<TData = Awaited<GetAccountsReturn>> = {
  enabled?: boolean,
  select?: (data: Awaited<GetAccountsReturn>) => TData,
}
export function useGetAccounts<TData = Awaited<GetAccountsReturn>>(options: UseGetAccountsOptions<TData> = {}) {
  return useQuery({
    queryKey: [BASE_KEY],
    queryFn: () => getAccounts(),
    ...options,
  });
}

/**
 * @param {Omit<UseMutationOptions, "mutationFn">} options
 * @returns {import("react-query").UseMutationResult}
 */
export function useUpdateAccountCredentialsById(options = {}) {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, ...changes }) => updateAccountCredentialsById(id, changes),
    {
      ...options,
      onSuccess(...args) {
        queryClient.invalidateQueries(BASE_KEY);
        options.onSuccess?.(...args);
      },
    }
  );
}

export type UseDeleteAccountByIdOptions = Omit<UseMutationOptions<any, unknown, string, unknown>, "mutationFn">;

export function useDeleteAccountById({ onSuccess, ...options }: UseDeleteAccountByIdOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation(
    {
      mutationFn: (id: string) => deleteAccountById(id),
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries([BASE_KEY]);
        onSuccess?.(data, variables, context);
      },
      ...options,
    }
  );
}

/**
 * @param {Omit<UseMutationOptions, "mutationFn">} options
 * @returns {import("react-query").UseMutationResult}
 */
export function useDeleteAccountByUser(options = {}) {
  const queryClient = useQueryClient();

  return useMutation(
    userId => deleteAccountByUser(userId),
    {
      ...options,
      onSuccess(...args) {
        queryClient.invalidateQueries(BASE_KEY);
        options.onSuccess?.(...args);
      },
    }
  );
}