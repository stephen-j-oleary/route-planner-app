import createUseMutationMock from "__utils__/createUseMutationMock";


export const useCreateDatabaseRoute = jest.fn().mockReturnValue(
  createUseMutationMock("success")()
);

export const useDeleteDatabaseRoute = jest.fn().mockReturnValue(
  createUseMutationMock("success")()
);