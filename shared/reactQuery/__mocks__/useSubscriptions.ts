import createUseMutationMock from "@/__utils__/createUseMutationMock";
import createUseQueryMock from "@/__utils__/createUseQueryMock";


export const useGetSubscriptions = jest.fn().mockImplementation(
  createUseQueryMock("success", {
    data: [],
  })
);

export const useUpdateSubscriptionById = jest.fn().mockReturnValue(
  createUseMutationMock("success")()
);

export const useCancelSubscriptionById = jest.fn().mockReturnValue(
  createUseMutationMock("success")()
);