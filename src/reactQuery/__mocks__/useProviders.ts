import createUseQueryMock from "__utils__/createUseQueryMock";


export const useGetProviders = jest.fn().mockImplementation(
  createUseQueryMock("success", {
    data: {
      google: {
        id: "google",
        name: "Google",
      },
    },
  })
);