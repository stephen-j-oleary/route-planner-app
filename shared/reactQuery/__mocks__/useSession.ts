import createUseQueryMock from "@/__utils__/createUseQueryMock";
import { IUser } from "@/shared/models/User";

export const useGetSession = jest.fn().mockImplementation(
  createUseQueryMock<IUser>("success", {
    data: {
      _id: "id",
      id: "id",
      image: "https://images.com/image",
      customerId: "customerId",
      email: "example@email.com",
      emailVerified: null,
    },
  })
);