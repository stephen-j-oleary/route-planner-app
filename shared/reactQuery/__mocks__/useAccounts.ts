import createUseMutationMock from "@/__utils__/createUseMutationMock";
import createUseQueryMock from "@/__utils__/createUseQueryMock";


export const { selectCredentialAccount } = jest.requireActual("@/shared/reactQuery/useAccounts");

export const useGetAccounts = jest.fn().mockImplementation(
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

export const useDeleteAccountById = jest.fn().mockReturnValue(
  createUseMutationMock("success")()
);

export const useDeleteAccountByUser = jest.fn().mockReturnValue(
  createUseMutationMock("success")()
);

export const useUpdateAccountCredentialsById = jest.fn().mockReturnValue(
  createUseMutationMock("success")()
);