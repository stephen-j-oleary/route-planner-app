import createUseMutationMock from "@/__utils__/createUseMutationMock";
import createUseQueryMock from "@/__utils__/createUseQueryMock";

export * from "react-query";

export const useQuery = jest.fn().mockImplementation(
  createUseQueryMock({ status: "success" })
);

export const useQueryClient = jest.fn().mockReturnValue({
  invalidateQueries: jest.fn(),
});

export const useMutation = jest.fn().mockImplementation(
  createUseMutationMock({ status: "success" })
);