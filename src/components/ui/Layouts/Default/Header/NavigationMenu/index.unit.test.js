import { render, screen } from "@testing-library/react";

import NavigationMenu from ".";
import createMatchMediaMock from "__utils__/createMatchMediaMock";

const DESKTOP_MATCHMEDIA = createMatchMediaMock({ width: "1000px" });
const NOHOVER_MATCHMEDIA = createMatchMediaMock({ width: "1000px", hover: "none" });
const MOBILE_MATCHMEDIA = createMatchMediaMock({ width: "100px" });


describe("NavigationMenu", () => {
  it("has a navigation menu", () => {
    render(<NavigationMenu />);

    expect(
      screen.getByRole("navigation", { hidden: true })
    ).toBeInTheDocument();
  });

  it("shows desktop navigation menu when device matches media queries", () => {
    window.matchMedia = DESKTOP_MATCHMEDIA;
    render(<NavigationMenu />);

    expect(
      screen.getByRole("navigation")
    ).toBeInTheDocument();
  });

  it("shows mobile navigation menu when device doesn't support hover", () => {
    window.matchMedia = NOHOVER_MATCHMEDIA;
    render(<NavigationMenu />);

    expect(
      screen.getByRole("button", { name: /toggle/i })
    ).toBeInTheDocument();
  });

  it("shows mobile navigation menu when device is too narrow", () => {
    window.matchMedia = MOBILE_MATCHMEDIA;
    render(<NavigationMenu />);

    expect(
      screen.getByRole("button", { name: /toggle/i })
    ).toBeInTheDocument();
  });
});