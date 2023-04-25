import createUseMutationMock from "@/__utils__/createUseMutationMock";


export const useUpdateSubscriptionById = jest.fn().mockReturnValue(
  createUseMutationMock({ status: "success" })()
);

export const useDeleteSubscriptionById = jest.fn().mockReturnValue(
  createUseMutationMock({ status: "success" })()
);