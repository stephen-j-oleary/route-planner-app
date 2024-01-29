import createUseMutationMock from "__utils__/createUseMutationMock";


export const useDeleteUserPaymentMethodById = jest.fn().mockReturnValue(
  createUseMutationMock("success")()
);