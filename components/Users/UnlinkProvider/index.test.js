import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signIn } from "next-auth/react";

import UnlinkProvider from ".";
import createUseDeferredMock from "@/__utils__/createUseDeferredMock";
import createUseQueryMock from "@/__utils__/createUseQueryMock";
import useDeferred from "@/shared/hooks/useDeferred";
import { useDeleteAccountById, useGetAccounts } from "@/shared/reactQuery/useAccounts";

jest.mock("@/shared/reactQuery/useAccounts");
jest.mock("@/shared/reactQuery/useProviders");
jest.mock("@/shared/hooks/useDeferred");

useGetAccounts.mockReturnValue(createUseQueryMock({
  status: "success",
  data: [{
    _id: "id",
    provider: "google",
  }],
})());

const VALID_PASSWORD = "ValidPassword1";


describe("UnlinkProvider", () => {
  afterEach(jest.clearAllMocks);

  it("is a button", () => {
    render(<UnlinkProvider />);

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("shows a form dialog", async () => {
    render(<UnlinkProvider />);

    await userEvent.click(screen.getByRole("button", { name: /unlink/i }));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("calls sign in and delete account when confirmed", async () => {
    render(<UnlinkProvider />);

    await userEvent.click(screen.getByRole("button", { name: /unlink/i }));
    await screen.findByRole("dialog"); // Wait for the dialog to show
    await userEvent.type(screen.getByLabelText(/new/i), VALID_PASSWORD);
    await userEvent.click(screen.getByRole("button", { name: /unlink/i }));

    expect(signIn).toBeCalledTimes(1);
    expect(useDeleteAccountById().mutate).toBeCalledTimes(1);
  });

  it("passes the correct data on submit", async () => {
    render(<UnlinkProvider />);

    await userEvent.click(screen.getByRole("button", { name: /unlink/i }));
    await screen.findByRole("dialog"); // Wait for the dialog to show
    await userEvent.type(screen.getByLabelText(/new/i), VALID_PASSWORD);
    await userEvent.click(screen.getByRole("button", { name: /unlink/i }));

    expect(signIn).toBeCalledWith(
      "credentials",
      expect.objectContaining({
        redirect: false,
        email: expect.any(String),
        password: VALID_PASSWORD,
      })
    );
  });

  it("does not call sign in or delete account when cancelled", async () => {
    render(<UnlinkProvider />);

    await userEvent.click(screen.getByRole("button", { name: /unlink/i }));
    await screen.findByRole("dialog"); // Wait for the dialog to show
    await userEvent.type(screen.getByLabelText(/new/i), VALID_PASSWORD);
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(signIn).not.toBeCalled();
    expect(useDeleteAccountById().mutate).not.toBeCalled();
  });

  it("does not call delete account when sign in fails", async () => {
    signIn.mockRejectedValue("CredentialsSignIn");
    render(<UnlinkProvider />);

    await userEvent.click(screen.getByRole("button", { name: /unlink/i }));
    await screen.findByRole("dialog"); // Wait for the dialog to show
    await userEvent.type(screen.getByLabelText(/new/i), VALID_PASSWORD);
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(useDeleteAccountById().mutate).not.toBeCalled();
  });

  it("inputs and submit are disabled when loading default values", async () => {
    useDeferred.mockImplementation(createUseDeferredMock());
    render(<UnlinkProvider />);

    await userEvent.click(screen.getByRole("button", { name: /unlink/i }));
    await screen.findByRole("dialog"); // Wait for the dialog to show

    expect(screen.getByLabelText(/new/i)).toBeDisabled();
    expect(screen.getByRole("button", { name: /unlink/i })).toBeDisabled();
  });

  it("submit is disabled when submitting", async () => {
    useDeleteAccountById.mockReturnValue({ isLoading: true });
    render(<UnlinkProvider />);

    await userEvent.click(screen.getByRole("button", { name: /unlink/i }));
    await screen.findByRole("dialog"); // Wait for the dialog to show

    expect(screen.getByRole("button", { name: /unlink/i })).toBeDisabled();
  });
});