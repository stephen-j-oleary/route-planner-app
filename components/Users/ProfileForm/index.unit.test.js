import { render, screen, waitFor } from "@testing-library/react";
import { useForm } from "react-hook-form";

import ProfileForm from ".";
import createUseFormMock from "@/__utils__/createUseFormMock";
import createUseMutationMock from "@/__utils__/createUseMutationMock";
import { useUpdateUserById } from "@/shared/reactQuery/useUsers";

jest.mock("@/shared/reactQuery/useSession");
jest.mock("@/shared/reactQuery/useUsers");

useForm.mockImplementation(createUseFormMock({
  formState: { isLoading: false },
  optionReplacements: { defaultValues: {} },
}));


describe("UserProfileForm", () => {
  afterEach(jest.clearAllMocks);

  it("has a name input", () => {
    render(<ProfileForm />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  it("disables inputs when form is loading", () => {
    useForm.mockImplementationOnce(createUseFormMock({
      formState: { isLoading: true },
      optionReplacements: { defaultValues: {} },
    }));
    render(<ProfileForm />);

    expect(screen.getByLabelText(/name/i)).toBeDisabled();
  });

  it("enables inputs when form is not loading", async () => {
    render(<ProfileForm />);

    expect(screen.getByLabelText(/name/i)).not.toBeDisabled();
  });

  it("shows an alert when submit is successful", async () => {
    useUpdateUserById.mockImplementationOnce(createUseMutationMock("success"));
    render(<ProfileForm />);

    expect(await screen.findByText(/changes saved/i)).toBeInTheDocument();
  });

  it("shows an alert when submit fails", async () => {
    useUpdateUserById.mockImplementationOnce(createUseMutationMock("error"));
    render(<ProfileForm />);

    expect(await screen.findByText(/an error occurred/i)).toBeInTheDocument();
  });

  it("hides save button when form values have not changed", () => {
    render(<ProfileForm />);

    expect(screen.queryByRole("button", { name: /save/i })).not.toBeInTheDocument();
  });

  it("shows save button when form values have changed", async () => {
    useForm.mockImplementationOnce(createUseFormMock({ formState: { isLoading: false, isDirty: true } }));
    render(<ProfileForm />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    });
  });
});