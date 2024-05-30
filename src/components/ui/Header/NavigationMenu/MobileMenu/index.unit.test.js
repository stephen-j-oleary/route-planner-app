import { getByRole, queryAllByRole, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReactDOM from "react-dom";

import MobileMenu from ".";

ReactDOM.createPortal = jest.fn();

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


describe("MobileMenu", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("has toggle button", () => {
    render(
      <MobileMenu
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("button", { name: /toggle/i })).toBeInTheDocument();
  });

  it("starts closed", () => {
    render(
      <MobileMenu
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("toggles on click", async () => {
    render(
      <MobileMenu
        {...MINIMAL_PROPS}
      />
    );
    const button = screen.getByRole("button", { name: /toggle/i });

    await userEvent.click(button);
    await waitFor(() => {
      expect(screen.queryByRole("list")).toBeInTheDocument();
    });

    await userEvent.click(button);
    await waitFor(() => {
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });
  });

  it("calls reactPortal for menu", () => {
    render(
      <MobileMenu
        {...MINIMAL_PROPS}
      />
    );

    expect(ReactDOM.createPortal).toBeCalledWith(
      expect.anything(),
      expect.anything(),
    );
  });

  it("calls reactPortal for backdrop", () => {
    render(
      <MobileMenu
        {...MINIMAL_PROPS}
      />
    );

    expect(ReactDOM.createPortal).toBeCalledWith(
      expect.anything(),
      expect.anything(),
    );
  });

  it("has links for each page", async () => {
    render(
      <MobileMenu
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /toggle/i }));
    const list = screen.getByRole("list");
    const links = queryAllByRole(list, "link");

    expect(links).toHaveLength(2);
  });

  it("has a dropdown with links for each nested page", async () => {
    render(
      <MobileMenu
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /toggle/i }));
    const list = screen.getByRole("list");
    const subList = getByRole(list, "list", { hidden: true });
    const links = queryAllByRole(subList, "link", { hidden: true });

    expect(links).toHaveLength(2);
  });
});