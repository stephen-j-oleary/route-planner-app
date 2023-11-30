import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

import UnlinkProvider from ".";
import createUseFormMock from "@/__utils__/createUseFormMock";
import createUseQueryMock from "@/__utils__/createUseQueryMock";
import { useDeleteAccountById, useGetAccounts } from "@/shared/reactQuery/useAccounts";
import { useGetProviders } from "@/shared/reactQuery/useProviders";
import { useGetSession } from "@/shared/reactQuery/useSession";

jest.mock("@/shared/reactQuery/useAccounts");
jest.mock("@/shared/reactQuery/useProviders");
jest.mock("@/shared/reactQuery/useSession");

const EMAIL = "example@email.com";
const VALID_PASSWORD = "ValidPassword1";


describe("UnlinkProvider", () => {
  beforeEach(() => {
    useForm.mockImplementation(createUseFormMock({
      formState: { isLoading: false },
      optionReplacements: { defaultValues: { email: EMAIL } },
    }));

    useGetAccounts.mockImplementation(createUseQueryMock("success", {
      data: [{
        _id: "id",
        provider: "google",
      }],
    }));

    useGetSession.mockReturnValue(createUseQueryMock("success", {
      data: { email: "email" },
    })());
  });

  afterEach(jest.clearAllMocks);

  it("renders nothing when accounts has no data", () => {
    useGetAccounts.mockImplementationOnce(createUseQueryMock("success"));
    render(<UnlinkProvider />);

    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("renders nothing when no provider account is found", () => {
    useGetAccounts.mockImplementationOnce(createUseQueryMock("success", {
      data: [{ provider: "credentials" }]
    }));
    render(<UnlinkProvider />);

    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("renders nothing when providers has no data", () => {
    useGetProviders.mockImplementationOnce(createUseQueryMock("success"));
    render(<UnlinkProvider />);

    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("has a placeholder when providers or accounts is loading", () => {
    useGetAccounts.mockImplementationOnce(createUseQueryMock("loading"));
    render(<UnlinkProvider />);

    expect(screen.getByRole("button", { hidden: true })).toBeInTheDocument();
  });

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
    useForm.mockImplementation(createUseFormMock({
      formState: { isLoading: true },
      optionReplacements: { defaultValues: { email: EMAIL } },
    }));
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