import { UseQueryResult } from "react-query";


type CreateUseQueryMockStatus = "error" | "loading" | "idle" | "success";
type CreateUseQueryMockParams<TData, TError> = {
  data?: TData,
  error?: TError,
};

export default function createUseQueryMock<TData = unknown, TError = unknown>(
  status: CreateUseQueryMockStatus,
  { data, error }: CreateUseQueryMockParams<TData, TError> = {}
) {
  const func = (options: { queryFn?: () => TData, select?: (data: TData) => TData } = {}) => {
    const unselectedData = data || options.queryFn?.() || undefined;

    const result: Pick<UseQueryResult<TData, TError>, "status" | "error" | "data" | "isIdle" | "isLoading" | "isError" | "isSuccess" | "isFetched"> = {
      status,
      error,
      data: options?.select?.(unselectedData) || unselectedData,
      isIdle: status === "idle",
      isLoading: status === "loading",
      isError: status === "error",
      isSuccess: status === "success",
      isFetched: status === "success",
    };

    return result;
  }

  return func;
}