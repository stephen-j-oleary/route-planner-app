import createUseMutationMock from "__utils__/createUseMutationMock";
import createUseQueryMock from "__utils__/createUseQueryMock";


export const useGetUser = jest.fn().mockReturnValue(
  createUseQueryMock("success", {
    data: {
      _id: "id",
      name: "name",
    },
  })()
)

export const useUpdateUser = jest.fn().mockReturnValue(
  createUseMutationMock("success")()
)

export const useDeleteUser = jest.fn().mockReturnValue(
  createUseMutationMock("success")()
)