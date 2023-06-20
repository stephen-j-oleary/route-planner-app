import createUseMutationMock from "@/__utils__/createUseMutationMock";
import createUseQueryMock from "@/__utils__/createUseQueryMock";


export const useGetAccounts = jest.fn().mockImplementation(
  createUseQueryMock({
    status: "success",
    data: [{
      _id: "id",
      provider: "credentials",
      credentials: {
        email: "email",
        password: "password",
      },
    }],
  })
);

export const useDeleteAccountById = jest.fn().mockReturnValue(
  createUseMutationMock({ status: "success" })()
);

export const useDeleteAccountByUser = jest.fn().mockReturnValue(
  createUseMutationMock({ status: "success" })()
);

export const useUpdateAccountCredentialsById = jest.fn().mockReturnValue(
  createUseMutationMock({ status: "success" })()
);