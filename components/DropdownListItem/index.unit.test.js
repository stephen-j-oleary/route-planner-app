import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DropdownListItem from ".";

const MINIMAL_PROPS = {
  listProps: {
    children: <li>Dropdown item</li>,
  },
  children: "Dropdown",
};

describe("DropdownListItem", () => {
  it("starts closed", () => {
    render(
      <DropdownListItem {...MINIMAL_PROPS} />
    );

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("opens on click", async () => {
    render(
      <DropdownListItem {...MINIMAL_PROPS} />
    );

    await userEvent.click(screen.getByRole("button", { name: /toggle sub-menu/i }));
    await waitFor(() => {
      expect(screen.getByRole("list")).toBeVisible();
    })
  });

  it("closes on second click", async () => {
    render(
      <DropdownListItem {...MINIMAL_PROPS} />
    );
    const button = screen.getByRole("button", { name: /toggle sub-menu/i });

    await userEvent.click(button);
    const list = await screen.findByRole("list");
    await waitFor(() => {
      expect(list).toBeVisible();
    });
    await userEvent.click(button);

    await waitFor(() => {
      expect(list).not.toBeVisible();
    });
  });
});