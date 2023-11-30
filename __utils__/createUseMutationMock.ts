import { MutateOptions, UseMutationResult } from "react-query";


type CreateUseMutationMockStatus = "error" | "loading" | "idle" | "success";
type CreateUseMutationMockParams<TData, TError> = {
  data?: TData,
  error?: TError,
};

interface UseMutationOptionsSync<TData, TError, TVariables> {
  mutationFn?: (variables: TVariables) => TData;
  onMutate?: (variables: TVariables) => void;
  onSuccess?: (data: TData, variables: TVariables, context: unknown) => void;
  onError?: (error: TError, variables: TVariables, context: unknown) => void;
  onSettled?: (data: TData, error: TError, variables: TVariables, context: unknown) => void;
}

type UseMutationResultSync<TData, TError, TVariables> =
  & Pick<UseMutationResult<TData, TError, TVariables>, "status" | "error" | "data" | "isIdle" | "isLoading" | "isError" | "isSuccess" | "mutate">
  & {
    mutateAsync: (variables: TVariables, options: MutateOptions<TData, TError, TVariables>) => void,
  };

export default function createUseMutationMock<TData = unknown, TError = unknown, TVariables = void>(
  status: CreateUseMutationMockStatus = "success",
  { error, data }: CreateUseMutationMockParams<TData, TError> = {}
) {
  const func = (options: UseMutationOptionsSync<TData, TError, TVariables> = {}) => {
    const result: UseMutationResultSync<TData, TError, TVariables> = {
      status,
      error,
      data,
      isIdle: status === "idle",
      isLoading: status === "loading",
      isError: status === "error",
      isSuccess: status === "success",
      mutate: jest.fn((variables, handlers = {}) => {
        options.onMutate?.(variables);

        const res = data || options?.mutationFn(variables);

        if (status === "success") {
          options.onSuccess?.(res, variables, null);
          handlers.onSuccess?.(res, variables, null);
        }
        if (status === "error") {
          options.onError?.(error, variables, null);
          handlers.onError?.(error, variables, null);
        }

        options.onSettled?.(res, error, variables, null);
        handlers.onSettled?.(res, error, variables, null);

        return;
      }),
      mutateAsync: jest.fn((variables, handlers = {}) => {
        options.onMutate?.(variables);

        const res = data || options.mutationFn(variables);

        if (status === "success") {
          options.onSuccess?.(res, variables, null);
          handlers.onSuccess?.(res, variables, null);
        }
        if (status === "error") {
          options.onError?.(error, variables, null);
          handlers.onError?.(error, variables, null);
        }

        options.onSettled?.(res, null, variables, null);
        handlers.onSettled?.(res, null, variables, null);

        return res;
      }),
    };

    return result;
  }

  return func;
}