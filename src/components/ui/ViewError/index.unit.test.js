import { render, screen } from "@testing-library/react";

import ViewError from ".";


describe("ViewError", () => {
  it("has the default primary text", () => {
    render(<ViewError />);

    expect(screen.getByText(/an error occurred/i)).toBeInTheDocument();
  });

  it("has the passed primary text", () => {
    const PRIMARY = "Primary text";
    render(
      <ViewError
        primary={PRIMARY}
      />
    );

    expect(screen.getByText(PRIMARY)).toBeInTheDocument();
  });

  it("has the passed primary component", () => {
    const PRIMARY = "Primary text";
    render(
      <ViewError
        primary={PRIMARY}
        primaryComponent="h2"
      />
    );

    expect(screen.getByRole("heading", { level: 2, name: PRIMARY })).toBeInTheDocument();
  });

  it("has the passed secondary text", () => {
    const SECONDARY = "Secondary text";
    render(
      <ViewError
        secondary={SECONDARY}
      />
    );

    expect(screen.getByText(SECONDARY)).toBeInTheDocument();
  });

  it("has the passed secondary component", () => {
    const SECONDARY = "Secondary text";
    render(
      <ViewError
        secondary={SECONDARY}
        secondaryComponent="h2"
      />
    );

    expect(screen.getByRole("heading", { level: 2, name: SECONDARY })).toBeInTheDocument();
  });

  it("has the passed actions", () => {
    const ACTION_ID = "action-id";
    render(
      <ViewError
        action={<div data-testid={ACTION_ID} />}
      />
    );

    expect(screen.getByTestId(ACTION_ID)).toBeInTheDocument();
  });
});