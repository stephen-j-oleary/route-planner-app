import { render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";

import AuthForm from ".";
import createUseFormMock from "@/__utils__/createUseFormMock";
import createUseMutationMock from "@/__utils__/createUseMutationMock";
import { useUpdateUserById } from "@/shared/reactQuery/useUsers";

jest.mock("@/shared/reactQuery/useSession");
jest.mock("@/shared/reactQuery/useUsers");
jest.mock("@/components/Users/ChangePassword", () => (
  function ChangePasswordMock() {
    return <div data-testid="ChangePassword" />
  }
));
jest.mock("@/components/Users/LinkProvider", () => (
  function LinkProviderMock() {
    return <div data-testid="LinkProvider" />;
  }
));
jest.mock("@/components/Users/UnlinkProvider", () => (
  function UnlinkProviderMock() {
    return <div data-testid="UnlinkProvider" />;
  }
));


describe("UserAuthForm", () => {
  it("has an email input", () => {
    render(<AuthForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it("shows an alert when submit is successful", () => {
    useUpdateUserById.mockImplementationOnce(createUseMutationMock({ status: "success" }));
    render(<AuthForm />);

    expect(screen.getByText(/changes saved/i)).toBeInTheDocument();
  });

  it("shows an alert when submit fails", () => {
    useUpdateUserById.mockImplementationOnce(createUseMutationMock({ status: "error" }));
    render(<AuthForm />);

    expect(screen.getByText(/an error occurred/i)).toBeInTheDocument();
  });

  it("hides save button when form values have not changed", () => {
    render(<AuthForm />);

    expect(screen.queryByRole("button", { name: /save/i })).not.toBeInTheDocument();
  });

  it("shows save button when form values have changed", async () => {
    useForm.mockImplementationOnce(createUseFormMock({ formState: { isLoading: false, isDirty: true } }));
    render(<AuthForm />);

    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("renders the change password button", () => {
    render(<AuthForm />);

    expect(screen.getByTestId("ChangePassword")).toBeInTheDocument();
  });

  it("renders the link provider button", () => {
    render(<AuthForm />);

    expect(screen.getByTestId("LinkProvider")).toBeInTheDocument();
  });

  it("renders the unlink provider button", () => {
    render(<AuthForm />);

    expect(screen.getByTestId("UnlinkProvider")).toBeInTheDocument();
  });
});