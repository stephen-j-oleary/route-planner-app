import createUseMutationMock from "@/__utils__/createUseMutationMock";


export const useDeleteUserById = jest.fn().mockReturnValue(
  createUseMutationMock({ status: "success" })()
);