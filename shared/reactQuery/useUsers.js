import { useMutation, useQueryClient } from "react-query";

import { deleteUserById, updateUserById } from "@/shared/services/users";

const BASE_KEY = "users";


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