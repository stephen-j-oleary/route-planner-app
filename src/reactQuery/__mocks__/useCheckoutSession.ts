import createUseMutationMock from "__utils__/createUseMutationMock";


export const useCreateUserCheckoutSession = jest.fn().mockReturnValue(
  createUseMutationMock("success", { data: { client_secret: "client-secret" } })()
);