jest.mock("@/shared/reactQuery/useAccounts");
jest.mock("@/shared/reactQuery/useProviders");

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signIn } from "next-auth/react";

import LinkProvider from ".";


describe("LinkProvider", () => {
  afterEach(() => jest.clearAllMocks());

  it("is a button", () => {
    render(<LinkProvider />);

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("shows a dialog", async () => {
    render(<LinkProvider />);

    await userEvent.click(screen.getByRole("button", { name: /link/i }));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("calls signIn when confirmed", async () => {
    render(<LinkProvider />);

    await userEvent.click(screen.getByRole("button", { name: /link/i }));
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: /link/i }));

    expect(signIn).toBeCalledTimes(1);
  });

  it("does not call signIn when canceled", async () => {
    render(<LinkProvider />);

    await userEvent.click(screen.getByRole("button", { name: /link/i }));
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(signIn).not.toBeCalled();
  });

  it("closes the confirmation dialog when canceled", async () => {
    render(<LinkProvider />);

    await userEvent.click(screen.getByRole("button", { name: /link/i }));
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});