import createUseMutationMock from "@/__utils__/createUseMutationMock";


export const useDeletePaymentMethodById = jest.fn().mockReturnValue(
  createUseMutationMock("success")()
);