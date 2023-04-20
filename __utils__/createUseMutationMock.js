/**
 * Returns a mock instance of useMutation that will hold the given status, error and data
 * @param {*} state The mocked state of the mutation
 * @returns {import("react-query").UseMutateFunction}
 */
export default function createUseMutationMock({ status, error, data } = {}) {
  return (mutationFn = () => {}, options = {}) => ({
    status,
    error,
    data,
    isIdle: status === "idle",
    isLoading: status === "loading",
    isError: status === "error",
    isPaused: status === "paused",
    isSuccess: status === "success",
    mutate: jest.fn((args, handlers = {}) => {
      options.onMutate?.(args);
      handlers.onMutate?.(args);

      const res = mutationFn(args);

      if (status === "success") {
        options.onSuccess?.(res, args);
        handlers.onSuccess?.(res, args);
      }
      if (status === "error") {
        options.onError?.(res, args);
        handlers.onError?.(res, args);
      }

      options.onSettled?.(res, null, args);
      handlers.onSettled?.(res, null, args);
    }),
    mutateAsync: jest.fn(async (args, handlers = {}) => {
      options.onMutate?.(args);
      handlers.onMutate?.(args);

      const res = mutationFn(args);

      if (status === "success") {
        options.onSuccess?.(res, args);
        handlers.onSuccess?.(res, args);
      }
      if (status === "error") {
        options.onError?.(res, args);
        handlers.onError?.(res, args);
      }

      options.onSettled?.(res, null, args);
      handlers.onSettled?.(res, null, args);
    }),
  });
}