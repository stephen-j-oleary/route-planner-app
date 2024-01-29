import createUseMutationMock from "__utils__/createUseMutationMock";


export const useCreateUserUpcomingInvoice = jest.fn().mockReturnValue(
  createUseMutationMock("success", { data: { lines: { data: [] } } })()
)