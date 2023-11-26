import createUseMutationMock from "@/__utils__/createUseMutationMock";


export const useCreateCheckoutSession = jest.fn().mockReturnValue(
  createUseMutationMock({ status: "success" })(() => ({ url: "url" }))
);