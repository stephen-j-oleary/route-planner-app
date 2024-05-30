import { queryAllByRole, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import UserMenu from ".";


describe("UserMenu", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("has sign in button if user is not authenticated", () => {
    render(<UserMenu />);

    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("has toggle button if user is authenticated", () => {
    render(<UserMenu />);

    expect(screen.getByRole("button", { name: /toggle user/i })).toBeInTheDocument();
  });

  it("starts closed", () => {
    render(<UserMenu />);

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("toggles on click", async () => {
    render(<UserMenu />);
    const button = screen.getByRole("button", { name: /toggle user/i });

    await userEvent.click(button);
    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    await userEvent.click(button);
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it("has a menu of links", async () => {
    render(<UserMenu />);

    await userEvent.click(screen.getByRole("button", { name: /toggle user/i }));
    const menu = screen.getByRole("menu");

    expect(queryAllByRole(menu, "menuitem").length).toBeGreaterThan(0);
  });
});