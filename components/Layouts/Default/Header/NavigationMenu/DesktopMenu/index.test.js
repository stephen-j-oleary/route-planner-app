import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DesktopMenu from ".";

const MINIMAL_PROPS = {
  pages: [
    { name: "Page 1", path: "/page-1" },
    { name: "Page 2", path: "/page-2/1", pages: [
      { name: "Page 2.1", path: "/page-2/1" },
      { name: "Page 2.2", path: "/page-2/2" },
    ] },
  ],
  isPageActive: () => false,
};


describe("DesktopMenu", () => {
  it("has links for each page", () => {
    render(
      <DesktopMenu
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getAllByRole("link")).toHaveLength(2);
  });

  it("has a dropdown for each nested page", () => {
    render(
      <DesktopMenu
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("link", { name: /page 2$/i })).toHaveAttribute("aria-haspopup");
  });

  it("has links for each nested page", async () => {
    render(
      <DesktopMenu
        {...MINIMAL_PROPS}
      />
    );
    const dropdownLink = screen.getByRole("link", { name: /page 2$/i });

    await userEvent.hover(dropdownLink);
    await waitFor(() => {
      expect(screen.getAllByRole("menuitem", { hidden: true })).toHaveLength(2);
    });
  });
});