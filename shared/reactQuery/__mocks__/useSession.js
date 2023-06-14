import createUseQueryMock from "@/__utils__/createUseQueryMock";

export const useGetSession = jest.fn().mockImplementation(
  createUseQueryMock({
    status: "success",
    data: {
      _id: "id",
      image: "https://images.com/image",
      email: "example@email.com",
    },
  })
);