import createUseMutationMock from "@/__utils__/createUseMutationMock";


export const useUpdateUserById = jest.fn().mockReturnValue(
  createUseMutationMock({ status: "success" })()
);

export const useDeleteUserById = jest.fn().mockReturnValue(
  createUseMutationMock({ status: "success" })()
);