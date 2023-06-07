import { useMutation, useQuery, useQueryClient } from "react-query";

import { deleteAccountById, deleteAccountByUser, getAccounts, updateAccountCredentialsById } from "@/shared/services/accounts";

const BASE_KEY = "accounts";


/**
 * @param {Omit<import("react-query").UseQueryOptions, "queryKey"|"queryFn">} options
 * @returns {import("react-query").UseQueryResult}
 */
export function useGetAccounts(options = {}) {
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

/**
 * @param {Omit<UseMutationOptions, "mutationFn">} options
 * @returns {import("react-query").UseMutationResult}
 */
export function useDeleteAccountById(options = {}) {
  const queryClient = useQueryClient();

  return useMutation(
    id => deleteAccountById(id),
    {
      ...options,
      onSuccess(...args) {
        queryClient.invalidateQueries(BASE_KEY);
        options.onSuccess?.(...args);
      },
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