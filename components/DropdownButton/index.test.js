import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DropdownButton from ".";

const MINIMAL_PROPS = {
  menuProps: {
    children: <li>Dropdown item</li>,
  },
  children: "Dropdown",
};


describe("DropdownButton", () => {
  it("starts closed", () => {
    render(
      <DropdownButton {...MINIMAL_PROPS} />
    );

    expect(screen.queryByRole("menu", { hidden: true })).not.toBeInTheDocument();
  });

  it("opens on hover", async () => {
    render(
      <DropdownButton {...MINIMAL_PROPS} />
    );

    await userEvent.hover(screen.getByRole("button", { name: /toggle sub-menu/i }));
    await waitFor(() => {
      expect(screen.getByRole("menu", { hidden: true })).toBeVisible();
    });
  });

  it("remains open on hover to menu", async () => {
    render(
      <DropdownButton {...MINIMAL_PROPS} />
    );

    await userEvent.hover(screen.getByRole("button", { name: /toggle sub-menu/i }));
    const menu = await screen.findByRole("menu", { hidden: true });
    await userEvent.hover(menu);

    expect(menu).toBeVisible();
  });

  it("closes on unhover", async () => {
    render(
      <DropdownButton {...MINIMAL_PROPS} />
    );
    const button = screen.getByRole("button", { name: /toggle sub-menu/i });

    await userEvent.hover(button);
    const menu = await screen.findByRole("menu", { hidden: true });
    await waitFor(() => {
      expect(menu).toBeVisible();
    });
    await userEvent.unhover(button);

    expect(menu).not.toBeVisible();
  });
});