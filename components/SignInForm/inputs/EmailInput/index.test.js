import { render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";

import EmailInput from ".";

const MINIMAL_PROPS = {
  name: "email",
  schema: {
    validateAt: jest.fn().mockResolvedValue(),
  },
};
const EMAIL_LABEL_REGEX = /^email$/i;


function setupForm() {
  const { result } = renderHook(() => useForm({ defaultValues: { email: "" } }));
  return result.current;
}

describe("SignInFormEmailInput", () => {
  it("is an input", () => {
    const form = setupForm();
    render(
      <EmailInput
        form={form}
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByLabelText(EMAIL_LABEL_REGEX)).toBeInTheDocument();
  });

  it("shows error message when schema validation fails", async () => {
    MINIMAL_PROPS.schema.validate.mockRejectedValueOnce({ errors: ["Error"] });
    const form = setupForm();
    const { container } = render(
      <EmailInput
        form={form}
        {...MINIMAL_PROPS}
      />
    );
    const input = screen.getByLabelText(EMAIL_LABEL_REGEX);

    expect(input).toBeValid();

    await userEvent.click(input);
    await userEvent.click(container);

    await waitFor(() => {
      expect(input).toBeInvalid();
    });
  });

  it("shows that email is registered when isRegistered is true", async () => {
    const form = setupForm();
    render(
      <EmailInput
        form={form}
        {...MINIMAL_PROPS}
        isRegistered
      />
    );
    const icon = screen.getByLabelText(/registered/i);

    expect(icon).toBeInTheDocument();

    await userEvent.hover(icon);

    await waitFor(() => {
      const tooltip = screen.getByRole("tooltip");
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveTextContent(/registered/i);
    });
  });

  it("handles changes", async () => {
    const VALUE = "value";
    const form = setupForm();
    render(
      <EmailInput
        form={form}
        {...MINIMAL_PROPS}
      />
    );
    const input = screen.getByLabelText(EMAIL_LABEL_REGEX);

    await userEvent.type(input, VALUE);

    await waitFor(() => {
      expect(form.getValues(MINIMAL_PROPS.name)).toBe(VALUE);
    });
  });
});