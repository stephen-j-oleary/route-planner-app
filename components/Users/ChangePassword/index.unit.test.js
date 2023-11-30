import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ChangePassword from ".";
import createUseQueryMock from "@/__utils__/createUseQueryMock";
import { useGetAccounts, useUpdateAccountCredentialsById } from "@/shared/reactQuery/useAccounts";

jest.mock("@/shared/reactQuery/useAccounts");

const VALID_PASSWORD = "ValidPassword1";


describe("ChangePassword", () => {
  afterEach(jest.clearAllMocks);

  it("renders nothing when accounts has no data", () => {
    useGetAccounts.mockImplementationOnce(createUseQueryMock("success"));
    render(<ChangePassword />);

    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("renders nothing when no credential account is found", () => {
    useGetAccounts.mockImplementationOnce(createUseQueryMock("success", {
      data: [{ provider: "google" }]
    }));
    render(<ChangePassword />);

    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("has a placeholder when accounts is loading", () => {
    useGetAccounts.mockImplementationOnce(createUseQueryMock("loading"));
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
    await userEvent.type(screen.getByLabelText(/current/i), VALID_PASSWORD);
    await userEvent.type(screen.getByLabelText(/new/i), VALID_PASSWORD);
    await userEvent.click(screen.getByRole("button", { name: /change/i }));

    expect(useUpdateAccountCredentialsById().mutate).toBeCalledTimes(1);
  });

  it("passes the correct data on submit", async () => {
    render(<ChangePassword />);

    await userEvent.click(screen.getByRole("button", { name: /change/i }));
    await screen.findByRole("dialog"); // Wait for the dialog to show
    await userEvent.type(screen.getByLabelText(/current/i), VALID_PASSWORD);
    await userEvent.type(screen.getByLabelText(/new/i), VALID_PASSWORD);
    await userEvent.click(screen.getByRole("button", { name: /change/i }));

    expect(useUpdateAccountCredentialsById().mutate).toBeCalledWith(
      expect.objectContaining({
        id: "id",
        oldCredentials: {
          email: "email",
          password: VALID_PASSWORD,
        },
        email: "email",
        password: VALID_PASSWORD,
      }),
      expect.anything()
    );
  });

  it("does not call change password when cancelled", async () => {
    render(<ChangePassword />);

    await userEvent.click(screen.getByRole("button", { name: /change/i }));
    await screen.findByRole("dialog"); // Wait for the dialog to show
    await userEvent.type(screen.getByLabelText(/current/i), VALID_PASSWORD);
    await userEvent.type(screen.getByLabelText(/new/i), VALID_PASSWORD);
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(useUpdateAccountCredentialsById().mutate).not.toBeCalled();
  });

  it("submit is disabled when submitting", async () => {
    useUpdateAccountCredentialsById.mockReturnValue({ isLoading: true });
    render(<ChangePassword />);

    await userEvent.click(screen.getByRole("button", { name: /change/i }));
    await screen.findByRole("dialog"); // Wait for the dialog to show

    expect(screen.getByRole("button", { name: /change/i })).toBeDisabled();
  });
});