import createUseMutationMock from "__utils__/createUseMutationMock";
import createUseQueryMock from "__utils__/createUseQueryMock";


export const useGetUserSubscriptions = jest.fn().mockImplementation(
  createUseQueryMock("success", {
    data: [],
  })
);

export const useUpdateUserSubscriptionById = jest.fn().mockReturnValue(
  createUseMutationMock("success")()
);

export const useCancelUserSubscriptionById = jest.fn().mockReturnValue(
  createUseMutationMock("success")()
);

export const useCancelUserSubscriptionAtPeriodEndById = jest.fn().mockReturnValue(
  createUseMutationMock("success")()
);