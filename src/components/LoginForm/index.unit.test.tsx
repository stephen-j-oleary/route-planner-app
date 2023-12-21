jest.mock("@/shared/reactQuery/useProviders");
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));
jest.mock("@/shared/services/users", () => ({
  getUsers: jest.fn(),
}));
jest.mock("@/shared/services/accounts", () => ({
  getAccounts: jest.fn(),
}));

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signIn } from "next-auth/react";

import Component from ".";
import QueryClientProvider from "@/providers/QueryClientProvider";
import { useGetProviders } from "@/reactQuery/useProviders";
import { getAccounts } from "@/services/accounts";
import { getUsers } from "@/services/users";
import createUseQueryMock from "__utils__/createUseQueryMock";

const mockedUseGetProviders = useGetProviders as jest.Mock;
const mockedSignIn = signIn as jest.Mock;
const mockedGetUsers = getUsers as jest.Mock;
const mockedGetAccounts = getAccounts as jest.Mock;


const wrapper = QueryClientProvider;

describe("LoginForm", () => {
  const INVALID_EMAIL = "notanemail";
  const VALID_EMAIL = "example@email.com";
  const INVALID_PASSWORD = "abc";

  const PROVIDER = { id: "provider_1", name: "Provider 1" };
  const USER = { _id: { toString: () => "user_1" } };
  const CREDENTIAL_ACCOUNT = { userId: USER._id, provider: "credentials" };
  const PROVIDER_ACCOUNT = { userId: USER._id, provider: "provider_1" };

  it("provider link redirects to provider login page", async () => {
    mockedUseGetProviders.mockReturnValue(createUseQueryMock("success", { data: { provider_1: PROVIDER } })());
    render(<Component />, { wrapper });

    const providerButtons = await screen.findAllByRole("button", { name: /continue with (?!email)/i });
    await userEvent.click(providerButtons[0]);

    await waitFor(() => {
      expect(mockedSignIn).toHaveBeenCalledWith(PROVIDER.id, { callbackUrl: expect.any(String) });
    });
  })

  it("shows error on submit when email is missing or invalid", async () => {
    render(<Component />, { wrapper });

    const emailInpt = screen.getByLabelText(/email/i);
    const submitBtn = screen.getByRole("button", { name: /continue with email/i });
    await userEvent.click(submitBtn);

    expect(emailInpt).toBeInvalid();
    expect(screen.getByText(/enter an email/i)).toBeVisible();

    await userEvent.type(emailInpt, INVALID_EMAIL);

    expect(emailInpt).toBeInvalid();
    expect(screen.getByText(/enter a valid email/i)).toBeVisible();
  })

  it("shows register form when email is not registered", async () => {
    mockedGetUsers.mockReturnValue([]); // No users found by email
    render(<Component />, { wrapper });

    const emailInpt = screen.getByLabelText(/email/i);
    const submitBtn = screen.getByRole("button", { name: /continue with email/i });
    await userEvent.type(emailInpt, VALID_EMAIL);
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /sign up/i })).toBeVisible();
    });
  })

  it("shows register error on submit when password is missing or invalid", async () => {
    mockedGetUsers.mockReturnValue([]);
    render(<Component />, { wrapper });

    const emailInpt = screen.getByLabelText(/email/i);
    const emailSbmt = screen.getByRole("button", { name: /continue with email/i });
    await userEvent.type(emailInpt, VALID_EMAIL);
    await userEvent.click(emailSbmt);

    const passwordInpt = await screen.findByLabelText(/create a password/i);
    const passwordSbmt = await screen.findByRole("button", { name: /sign up/i });
    await userEvent.click(passwordSbmt);

    expect(passwordInpt).toBeInvalid();

    await userEvent.type(passwordInpt, INVALID_PASSWORD);

    expect(passwordInpt).toBeInvalid();
  })

  it("shows login form when email is registered with password credentials", async () => {
    mockedGetUsers.mockReturnValue([USER]);
    mockedGetAccounts.mockReturnValue([CREDENTIAL_ACCOUNT]);
    render(<Component />, { wrapper });

    const emailInpt = screen.getByLabelText(/email/i);
    const submitBtn = screen.getByRole("button", { name: /continue with email/i });
    await userEvent.type(emailInpt, VALID_EMAIL);
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /login/i })).toBeVisible();
    });
  })

  it("shows login error on submit when password is missing", async () => {
    mockedGetUsers.mockReturnValue([USER]);
    mockedGetAccounts.mockReturnValue([CREDENTIAL_ACCOUNT]);
    render(<Component />, { wrapper });

    const emailInpt = screen.getByLabelText(/email/i);
    const emailSbmt = screen.getByRole("button", { name: /continue with email/i });
    await userEvent.type(emailInpt, VALID_EMAIL);
    await userEvent.click(emailSbmt);

    const passwordInpt = await screen.findByLabelText(/^password$/i);
    const passwordSbmt = await screen.findByRole("button", { name: /login/i });
    await userEvent.click(passwordSbmt);

    expect(passwordInpt).toBeInvalid();

    await userEvent.type(passwordInpt, INVALID_PASSWORD);

    expect(passwordInpt).toBeValid();
  })

  it("redirects to provider login when email is registed with provider", async () => {
    mockedGetUsers.mockReturnValue([USER]);
    mockedGetAccounts.mockReturnValue([PROVIDER_ACCOUNT]);
    render(<Component />, { wrapper });

    const emailInpt = screen.getByLabelText(/email/i);
    const submitBtn = screen.getByRole("button", { name: /continue with email/i });
    await userEvent.type(emailInpt, VALID_EMAIL);
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockedSignIn).toHaveBeenCalledWith(PROVIDER_ACCOUNT.provider, { callbackUrl: expect.any(String) });
    });
  })
})