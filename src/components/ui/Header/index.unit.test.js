import { render, screen } from "@testing-library/react";

import Header from ".";


describe("Header", () => {
  it("is a header", async () => {
    render(<Header />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("has a title", async () => {
    render(<Header />);

    expect(screen.getByRole("heading")).toHaveTextContent(/loop/i);
  });

  it("has navigation", () => {
    render(<Header />);

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("has user menu", () => {
    render(<Header />);

    expect(screen.getByRole("button", { name: /toggle user/i })).toBeInTheDocument();
  });
});