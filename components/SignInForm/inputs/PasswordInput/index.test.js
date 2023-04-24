import { render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";

import PasswordInput from ".";

const MINIMAL_PROPS = {
  name: "password",
  schema: {
    validateAt: jest.fn().mockResolvedValue(),
  },
};
const PASSWORD_LABEL_REGEX = /^create a password$|^password$/i;


function setupForm() {
  const { result } = renderHook(() => useForm());
  return result.current;
}

describe("SignInFormPasswordInput", () => {
  it("is an input", () => {
    const form = setupForm();
    render(
      <PasswordInput
        form={form}
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByLabelText(PASSWORD_LABEL_REGEX)).toBeInTheDocument();
  });

  it("shows error message when schema validation fails", async () => {
    MINIMAL_PROPS.schema.validateAt.mockRejectedValueOnce({ errors: ["Error"] });
    const form = setupForm();
    const { container } = render(
      <PasswordInput
        form={form}
        {...MINIMAL_PROPS}
      />
    );
    const input = screen.getByLabelText(PASSWORD_LABEL_REGEX);

    expect(input).toBeValid();

    await userEvent.click(input);
    await userEvent.click(container);

    await waitFor(() => {
      expect(input).toBeInvalid();
    });
  });

  it("has a password visibility switch that toggles password visibility", async () => {
    const form = setupForm();
    render(
      <PasswordInput
        form={form}
        {...MINIMAL_PROPS}
      />
    );
    const input = screen.getByLabelText(PASSWORD_LABEL_REGEX);
    const button = screen.getByRole("switch", { name: /show password/i });

    expect(button).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "password");

    await userEvent.click(button);

    expect(input).toHaveAttribute("type", "text");

    await userEvent.click(button);

    expect(input).toHaveAttribute("type", "password");
  });

  it("handles changes", async () => {
    const VALUE = "value";
    const form = setupForm();
    render(
      <PasswordInput
        form={form}
        {...MINIMAL_PROPS}
      />
    );
    const input = screen.getByLabelText(PASSWORD_LABEL_REGEX);

    await userEvent.type(input, VALUE);

    await waitFor(() => {
      expect(form.getValues(MINIMAL_PROPS.name)).toBe(VALUE);
    });
  });

  it("shows new password requirements", () => {
    const form = setupForm();
    render(
      <PasswordInput
        form={form}
        {...MINIMAL_PROPS}
        isNew
      />
    );

    expect(screen.getByText(/at least \d+ characters/i)).toBeInTheDocument();
    expect(screen.getByText(/at least \d+ uppercase/i)).toBeInTheDocument();
    expect(screen.getByText(/at least \d+ lowercase/i)).toBeInTheDocument();
    expect(screen.getByText(/at least \d+ number/i)).toBeInTheDocument();
  });
});