import createUseQueryMock from "__utils__/createUseQueryMock";

export const { selectUser, selectCustomerId } = jest.requireActual("@/reactQuery/useSession");

export const useGetSession = jest.fn().mockImplementation(
  createUseQueryMock("success", {
    data: {
      user: {
        _id: "id",
        id: "id",
        image: "https://images.com/image",
        customerId: "customerId",
        email: "example@email.com",
        emailVerified: null,
      },
    },
  })
);