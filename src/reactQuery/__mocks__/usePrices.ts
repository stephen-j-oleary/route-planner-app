import createUseQueryMock from "__utils__/createUseQueryMock";


export const useGetPriceById = jest.fn().mockImplementation(
  createUseQueryMock("success", {
    data: {},
  })
);

export const useGetPrices = jest.fn().mockImplementation(
  createUseQueryMock("success", {
    data: [],
  })
);