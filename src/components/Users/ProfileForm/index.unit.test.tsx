jest.mock("@/reactQuery/useSession");
jest.mock("@/reactQuery/useUsers");

import { render, screen, waitFor } from "@testing-library/react";
import { useForm } from "react-hook-form";

import ProfileForm from ".";
import { useUpdateUserById } from "@/reactQuery/useUsers";
import createUseFormMock, { createFormState } from "__utils__/createUseFormMock";
import createUseMutationMock from "__utils__/createUseMutationMock";

const mockedUseForm = useForm as jest.Mock;
const mockedUseUpdateUserById = useUpdateUserById as jest.Mock;


describe("UserProfileForm", () => {
  beforeAll(() => {
    mockedUseForm.mockImplementation(createUseFormMock({
      formState: createFormState({ isLoading: false }),
      optionReplacements: { defaultValues: {} },
    }));
  })
  afterEach(() => jest.clearAllMocks())

  it("has a name input", () => {
    render(<ProfileForm />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  it("disables inputs when form is loading", () => {
    mockedUseForm.mockImplementationOnce(createUseFormMock({
      formState: createFormState({ isLoading: true }),
      optionReplacements: { defaultValues: {} },
    }));
    render(<ProfileForm />);

    expect(screen.getByLabelText(/name/i)).toBeDisabled();
  });

  it("enables inputs when form is not loading", async () => {
    render(<ProfileForm />);

    expect(screen.getByLabelText(/name/i)).toBeEnabled();
  });

  it("shows an alert when submit is successful", async () => {
    mockedUseUpdateUserById.mockImplementationOnce(createUseMutationMock("success"));
    render(<ProfileForm />);

    expect(await screen.findByText(/changes saved/i)).toBeInTheDocument();
  });

  it("shows an alert when submit fails", async () => {
    mockedUseUpdateUserById.mockImplementationOnce(createUseMutationMock("error"));
    render(<ProfileForm />);

    expect(await screen.findByText(/an error occurred/i)).toBeInTheDocument();
  });

  it("hides save button when form values have not changed", () => {
    render(<ProfileForm />);

    expect(screen.queryByRole("button", { name: /save/i })).not.toBeInTheDocument();
  });

  it("shows save button when form values have changed", async () => {
    mockedUseForm.mockImplementationOnce(createUseFormMock({
      formState: createFormState({ isLoading: false, isDirty: true }),
    }));
    render(<ProfileForm />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    });
  });
});