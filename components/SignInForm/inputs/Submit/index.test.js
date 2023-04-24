import { render, screen } from "@testing-library/react";

import Submit from ".";


describe("SignInFormSubmit", () => {
  it("is a button", () => {
    render(<Submit />);

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("has the passed submit text", () => {
    const TEXT = "submit text";
    render(
      <Submit
        submitText={TEXT}
      />
    );

    expect(screen.getByRole("button", { name: TEXT })).toBeInTheDocument();
  });

  it("has the expected icon", () => {
    render(<Submit />);

    expect(screen.getByTestId(/email/i)).toBeInTheDocument();
  });
});