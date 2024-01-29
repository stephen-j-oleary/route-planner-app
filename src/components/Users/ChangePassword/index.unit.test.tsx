jest.mock("@/reactQuery/useAccounts");

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ChangePassword from ".";
import { useGetUserAccounts, useUpdateUserAccountById } from "@/reactQuery/useAccounts";
import createUseMutationMock from "__utils__/createUseMutationMock";
import createUseQueryMock from "__utils__/createUseQueryMock";

const mockedUseGetUserAccounts = useGetUserAccounts as jest.Mock;
const mockedUseUpdateUserAccountById = useUpdateUserAccountById as jest.Mock;


describe("ChangePassword", () => {
  const validPassword = "ValidPassword1";

  afterEach(() => jest.clearAllMocks())

  it("renders nothing when accounts has no data", () => {
    mockedUseGetUserAccounts.mockReturnValueOnce(createUseQueryMock("success")());
    render(<ChangePassword />);

    expect(screen.queryAllByRole("button")).toHaveLength(0);
  })

  it("renders nothing when no credential account is found", () => {
    mockedUseGetUserAccounts.mockReturnValueOnce(createUseQueryMock("success", {
      data: null
    })());
    render(<ChangePassword />);

    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("has a placeholder when accounts is loading", () => {
    mockedUseGetUserAccounts.mockReturnValueOnce(createUseQueryMock("loading")());
    render(<ChangePassword />);

    expect(screen.getByRole("button", { hidden: true })).toBeInTheDocument();
  });

  it("is a button", () => {
    render(<ChangePassword />);

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("shows a form dialog", async () => {
    render(<ChangePassword />);

    await userEvent.click(screen.getByRole("button", { name: /change/i }));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("calls change password when confirmed", async () => {
    render(<ChangePassword />);

    await userEvent.click(screen.getByRole("button", { name: /change/i }));
    await screen.findByRole("dialog"); // Wait for the dialog to show
    await userEvent.type(screen.getByLabelText(/current/i), validPassword);
    await userEvent.type(screen.getByLabelText(/new/i), validPassword);
    await userEvent.click(screen.getByRole("button", { name: /change/i }));

    expect(mockedUseUpdateUserAccountById().mutate).toHaveBeenCalledTimes(1);
  });

  it("passes the correct data on submit", async () => {
    render(<ChangePassword />);

    await userEvent.click(screen.getByRole("button", { name: /change/i }));
    await screen.findByRole("dialog"); // Wait for the dialog to show
    await userEvent.type(screen.getByLabelText(/current/i), validPassword);
    await userEvent.type(screen.getByLabelText(/new/i), validPassword);
    await userEvent.click(screen.getByRole("button", { name: /change/i }));

    expect(mockedUseUpdateUserAccountById().mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "id",
        oldCredentials: {
          email: "email",
          password: validPassword,
        },
        email: "email",
        password: validPassword,
      })
    );
  });

  it("does not call change password when canceled", async () => {
    render(<ChangePassword />);

    await userEvent.click(screen.getByRole("button", { name: /change/i }));
    await screen.findByRole("dialog"); // Wait for the dialog to show
    await userEvent.type(screen.getByLabelText(/current/i), validPassword);
    await userEvent.type(screen.getByLabelText(/new/i), validPassword);
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(mockedUseUpdateUserAccountById().mutate).not.toHaveBeenCalled();
  });

  it("submit is disabled when submitting", async () => {
    mockedUseUpdateUserAccountById.mockReturnValueOnce(createUseMutationMock("loading")());
    render(<ChangePassword />);

    await userEvent.click(screen.getByRole("button", { name: /change/i }));
    await screen.findByRole("dialog"); // Wait for the dialog to show

    expect(screen.getByRole("button", { name: /change/i })).toBeDisabled();
  });
});