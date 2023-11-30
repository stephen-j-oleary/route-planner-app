import createUseMutationMock from "@/__utils__/createUseMutationMock";


export const useCreateUpcomingInvoice = jest.fn().mockReturnValue(
  createUseMutationMock("success", { data: { lines: { data: [] } } })()
)