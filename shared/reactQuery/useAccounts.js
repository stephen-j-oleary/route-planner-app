import { useMutation, useQuery, useQueryClient } from "react-query";

import { getAccounts, updateAccountCredentialsById } from "@/shared/services/accounts";

const BASE_KEY = "accounts";


export function useGetAccounts(options = {}) {
  return useQuery({
    queryKey: [BASE_KEY],
    queryFn: () => getAccounts(),
    ...options,
  });
}

export function useUpdateAccountCredentialsById() {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, ...changes }) => updateAccountCredentialsById(id, changes),
    {
      onSuccess() {
        queryClient.invalidateQueries(BASE_KEY);
      },
    }
  );
}