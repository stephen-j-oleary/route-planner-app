import createUseQueryMock from "@/__utils__/createUseQueryMock";


export const useGetProviders = jest.fn().mockImplementation(
  createUseQueryMock({
    status: "success",
    data: {
      google: {
        id: "google",
        name: "Google",
      },
    },
  })
);