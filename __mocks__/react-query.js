import createUseMutationMock from "@/__utils__/createUseMutationMock";

export const useQuery = jest.fn().mockReturnValue({
  isFetched: true,
  isSuccess: true,
  isLoading: false,
  isError: false,
});

export const useQueryClient = jest.fn();

export const useMutation = jest.fn().mockImplementation(
  createUseMutationMock({ status: "success" })
);