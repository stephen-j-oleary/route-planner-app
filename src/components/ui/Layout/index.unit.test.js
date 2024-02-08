import { render, screen } from "@testing-library/react";

import Layout from ".";


describe("Layout", () => {
  it("has a header", () => {
    render(<Layout />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("has a main", () => {
    render(<Layout />);

    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("has a footer", () => {
    render(<Layout />);

    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("has the passed children", () => {
    const CHILD_ID = "child-id";
    render(
      <Layout>
        <div data-testid={CHILD_ID} />
      </Layout>
    );

    expect(screen.getByTestId(CHILD_ID)).toBeInTheDocument();
  });
});