import { render, screen } from "@testing-library/react";

import DefaultLayout from ".";


describe("DefaultLayout", () => {
  it("has a header", () => {
    render(<DefaultLayout />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("has a main", () => {
    render(<DefaultLayout />);

    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("has a footer", () => {
    render(<DefaultLayout />);

    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("has the passed children", () => {
    const CHILD_ID = "child-id";
    render(
      <DefaultLayout>
        <div data-testid={CHILD_ID} />
      </DefaultLayout>
    );

    expect(screen.getByTestId(CHILD_ID)).toBeInTheDocument();
  });
});