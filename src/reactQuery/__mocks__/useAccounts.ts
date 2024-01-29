import createUseMutationMock from "__utils__/createUseMutationMock";
import createUseQueryMock from "__utils__/createUseQueryMock";


export const { selectCredentialAccount } = jest.requireActual("@/reactQuery/useAccounts");

export const useGetUserAccounts = jest.fn().mockImplementation(
  createUseQueryMock("success", {
    data: [{
      _id: {
        toString: () => "id",
      },
      provider: "credentials",
      credentials_email: "email",
      credentials_password: "password",
    }],
  })
);

export const useUpdateUserAccountById = jest.fn().mockReturnValue(
  createUseMutationMock("success")()
);

export const useDeleteUserAccountById = jest.fn().mockReturnValue(
  createUseMutationMock("success")()
);