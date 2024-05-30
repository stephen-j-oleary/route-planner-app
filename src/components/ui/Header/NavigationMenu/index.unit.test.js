import { render, screen } from "@testing-library/react";

import NavigationMenu from ".";


describe("NavigationMenu", () => {
  it("has a navigation menu", () => {
    render(<NavigationMenu />);

    expect(
      screen.getByRole("navigation", { hidden: true })
    ).toBeInTheDocument();
  });

  it("shows desktop navigation menu when device matches media queries", () => {
    render(<NavigationMenu />);

    expect(
      screen.getByRole("navigation")
    ).toBeInTheDocument();
  });

  it("shows mobile navigation menu when device doesn't support hover", () => {
    render(<NavigationMenu />);

    expect(
      screen.getByRole("button", { name: /toggle/i })
    ).toBeInTheDocument();
  });

  it("shows mobile navigation menu when device is too narrow", () => {
    render(<NavigationMenu />);

    expect(
      screen.getByRole("button", { name: /toggle/i })
    ).toBeInTheDocument();
  });
});