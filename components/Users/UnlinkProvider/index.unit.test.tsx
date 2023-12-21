jest.mock("@/shared/reactQuery/useAccounts");
jest.mock("@/shared/reactQuery/useProviders");
jest.mock("@/shared/reactQuery/useSession");

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

import UnlinkProvider from ".";
import createUseFormMock, { createFormState } from "@/__utils__/createUseFormMock";
import createUseQueryMock from "@/__utils__/createUseQueryMock";
import QueryClientProvider from "@/shared/providers/QueryClientProvider";
import { useDeleteAccountById, useGetAccounts } from "@/shared/reactQuery/useAccounts";
import { useGetProviders } from "@/shared/reactQuery/useProviders";
import { useGetSession } from "@/shared/reactQuery/useSession";

const mockedUseForm = useForm as jest.Mock;
const mockedUseGetAccounts = useGetAccounts as jest.Mock;
const mockedUseDeleteAccountById = useDeleteAccountById as jest.Mock;
const mockedUseGetSession = useGetSession as jest.Mock;
const mockedUseGetProviders = useGetProviders as jest.Mock;
const mockedSignIn = signIn as jest.Mock;

const EMAIL = "example@email.com";
const VALID_PASSWORD = "ValidPassword1";


const wrapper = () => <QueryClientProvider />;

describe("UnlinkProvider", () => {
  beforeEach(() => {
    mockedUseForm.mockImplementation(createUseFormMock({
      formState: createFormState({ isLoading: false }),
      optionReplacements: { defaultValues: { email: EMAIL } },
    }));

    mockedUseGetAccounts.mockImplementation(createUseQueryMock("success", {
      data: [{
        _id: "id",
        provider: "google",
      }],
    }));

    mockedUseGetSession.mockReturnValue(createUseQueryMock("success", {
      data: { email: "email" },
    })());
  })

  afterEach(() => jest.clearAllMocks())

  it("renders nothing when accounts has no data", () => {
    mockedUseGetAccounts.mockImplementationOnce(createUseQueryMock("success"));
    render(<UnlinkProvider />, { wrapper });

    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("renders nothing when no provider account is found", () => {
    mockedUseGetAccounts.mockImplementationOnce(createUseQueryMock("success", {
      data: [{ provider: "credentials" }]
    }));
    render(<UnlinkProvider />, { wrapper });

    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("renders nothing when providers has no data", () => {
    mockedUseGetProviders.mockImplementationOnce(createUseQueryMock("success"));
    render(<UnlinkProvider />, { wrapper });

    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("has a placeholder when providers or accounts is loading", () => {
    mockedUseGetAccounts.mockImplementationOnce(createUseQueryMock("loading"));
    render(<UnlinkProvider />, { wrapper });

    expect(screen.getByRole("button", { hidden: true })).toBeInTheDocument();
  });

  it("is a button", () => {
    render(<UnlinkProvider />, { wrapper });

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("shows a form dialog", async () => {
    render(<UnlinkProvider />, { wrapper });

    await userEvent.click(screen.getByRole("button", { name: /unlink/i }));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("calls sign in and delete account when confirmed", async () => {
    render(<UnlinkProvider />, { wrapper });

    await userEvent.click(screen.getByRole("button", { name: /unlink/i }));
    await screen.findByRole("dialog"); // Wait for the dialog to show
    await userEvent.type(screen.getByLabelText(/new/i), VALID_PASSWORD);
    await userEvent.click(screen.getByRole("button", { name: /unlink/i }));

    expect(mockedSignIn).toHaveBeenCalledTimes(1);
    expect(mockedUseDeleteAccountById().mutate).toHaveBeenCalledTimes(1);
  });

  it("passes the correct data on submit", async () => {
    render(<UnlinkProvider />, { wrapper });

    await userEvent.click(screen.getByRole("button", { name: /unlink/i }));
    await screen.findByRole("dialog"); // Wait for the dialog to show
    await userEvent.type(screen.getByLabelText(/new/i), VALID_PASSWORD);
    await userEvent.click(screen.getByRole("button", { name: /unlink/i }));

    expect(mockedSignIn).toHaveBeenCalledWith(
      "credentials",
      expect.objectContaining({
        redirect: false,
        email: expect.any(String),
        password: VALID_PASSWORD,
      })
    );
  });

  it("does not call sign in or delete account when canceled", async () => {
    render(<UnlinkProvider />, { wrapper });

    await userEvent.click(screen.getByRole("button", { name: /unlink/i }));
    await screen.findByRole("dialog"); // Wait for the dialog to show
    await userEvent.type(screen.getByLabelText(/new/i), VALID_PASSWORD);
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(mockedSignIn).not.toHaveBeenCalled();
    expect(mockedUseDeleteAccountById().mutate).not.toHaveBeenCalled();
  });

  it("does not call delete account when sign in fails", async () => {
    mockedSignIn.mockRejectedValue("CredentialsSignIn");
    render(<UnlinkProvider />, { wrapper });

    await userEvent.click(screen.getByRole("button", { name: /unlink/i }));
    await screen.findByRole("dialog"); // Wait for the dialog to show
    await userEvent.type(screen.getByLabelText(/new/i), VALID_PASSWORD);
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(mockedUseDeleteAccountById().mutate).not.toHaveBeenCalled();
  });

  it("inputs and submit are disabled when loading default values", async () => {
    mockedUseForm.mockImplementation(createUseFormMock({
      formState: createFormState({ isLoading: true }),
      optionReplacements: { defaultValues: { email: EMAIL } },
    }));
    render(<UnlinkProvider />, { wrapper });

    await userEvent.click(screen.getByRole("button", { name: /unlink/i }));
    await screen.findByRole("dialog"); // Wait for the dialog to show

    expect(screen.getByLabelText(/new/i)).toBeDisabled();
    expect(screen.getByRole("button", { name: /unlink/i })).toBeDisabled();
  });

  it("submit is disabled when submitting", async () => {
    mockedUseDeleteAccountById.mockReturnValue({ isLoading: true });
    render(<UnlinkProvider />, { wrapper });

    await userEvent.click(screen.getByRole("button", { name: /unlink/i }));
    await screen.findByRole("dialog"); // Wait for the dialog to show

    expect(screen.getByRole("button", { name: /unlink/i })).toBeDisabled();
  });
});