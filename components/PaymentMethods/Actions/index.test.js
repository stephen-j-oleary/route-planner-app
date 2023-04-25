import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PaymentMethodActions } from ".";


describe("PaymentMethodActions", () => {
  it("has a toggle button", () => {
    render(<PaymentMethodActions />);

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("toggles a menu on click", async () => {
    render(<PaymentMethodActions />);
    const button = screen.getByRole("button");

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    await userEvent.click(button);
    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    await userEvent.click(button);
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it("has a delete action", async () => {
    render(<PaymentMethodActions />);

    await userEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });
    expect(screen.getByRole("menuitem", { name: /delete/i })).toBeInTheDocument();
  });
});