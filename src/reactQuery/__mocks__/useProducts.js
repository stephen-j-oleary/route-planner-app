import createUseQueryMock from "__utils__/createUseQueryMock";


export const useGetProducts = jest.fn().mockImplementation(
  createUseQueryMock("success", {
    data: [],
  })
);