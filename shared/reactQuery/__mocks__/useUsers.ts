import createUseMutationMock from "@/__utils__/createUseMutationMock";
import createUseQueryMock from "@/__utils__/createUseQueryMock";


export const useGetUserById = jest.fn().mockReturnValue(
  createUseQueryMock("success", {
    data: {
      _id: "id",
      name: "name",
    },
  })()
)

export const useUpdateUserById = jest.fn().mockReturnValue(
  createUseMutationMock("success")()
)

export const useDeleteUserById = jest.fn().mockReturnValue(
  createUseMutationMock("success")()
)