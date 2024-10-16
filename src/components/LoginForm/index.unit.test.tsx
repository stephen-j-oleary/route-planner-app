jest.mock("@/app/api/users/actions", () => ({
  getUsers: jest.fn(),
}));
jest.mock("@/app/api/accounts/actions", () => ({
  getAccounts: jest.fn(),
}));

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Component from ".";
import { getAccounts } from "@/app/api/accounts/actions";
import { getUsers } from "@/app/api/users/actions";

const mockedGetUsers = getUsers as jest.Mock;
const mockedGetAccounts = getAccounts as jest.Mock;


describe("LoginForm", () => {
  const INVALID_EMAIL = "notanemail";
  const VALID_EMAIL = "example@email.com";
  const INVALID_PASSWORD = "abc";

  const USER = { _id: { toString: () => "user_1" } };
  const CREDENTIAL_ACCOUNT = { userId: USER._id, provider: "credentials" };
  const PROVIDER_ACCOUNT = { userId: USER._id, provider: "provider_1" };

  it("provider link redirects to provider login page", async () => {
    render(<Component />);

    const providerButtons = await screen.findAllByRole("button", { name: /continue with (?!email)/i });
    if (!providerButtons[0]) throw new Error("No provider buttons found");
    await userEvent.click(providerButtons[0]);

    //await waitFor(() => {
      expect(false).toBe(true);
    //});
  })

  it("shows error on submit when email is missing or invalid", async () => {
    render(<Component />);

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
    render(<Component />);

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
    render(<Component />);

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
    render(<Component />);

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
    render(<Component />);

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
    render(<Component />);

    const emailInpt = screen.getByLabelText(/email/i);
    const submitBtn = screen.getByRole("button", { name: /continue with email/i });
    await userEvent.type(emailInpt, VALID_EMAIL);
    await userEvent.click(submitBtn);

    //await waitFor(() => {
      expect(false).toBe(true);
    //});
  })
})