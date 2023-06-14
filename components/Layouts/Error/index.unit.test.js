import { render, screen } from "@testing-library/react";

import ErrorLayout from ".";


describe("ErrorLayout", () => {
  it("has a header", () => {
    render(<ErrorLayout />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("has a main", () => {
    render(<ErrorLayout />);

    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("has a footer", () => {
    render(<ErrorLayout />);

    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("has the passed children", () => {
    const CHILD_ID = "children";
    render(
      <ErrorLayout>
        <div data-testid={CHILD_ID} />,
      </ErrorLayout>
    );

    expect(screen.getByTestId(CHILD_ID)).toBeInTheDocument();
  });
});