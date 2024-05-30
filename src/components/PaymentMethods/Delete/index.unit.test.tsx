import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DeletePaymentMethod from ".";

const MINIMAL_PROPS = {
  paymentMethod: {
    id: "id",
  },
};


describe("PaymentMethodActions", () => {
  afterEach(() => jest.clearAllMocks());

  it("is a menuitem", () => {
    render(
      <DeletePaymentMethod
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("menuitem", { name: /delete/i })).toBeInTheDocument();
  });

  it("is disabled when mutation is loading", () => {
    render(
      <DeletePaymentMethod
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("menuitem", { name: /delete/i })).toHaveAttribute("aria-disabled");
  });

  it("shows a confirmation dialog", async () => {
    render(
      <DeletePaymentMethod
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.click(screen.getByRole("menuitem", { name: /delete/i }));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("calls delete when confirmed", async () => {
    render(
      <DeletePaymentMethod
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.click(screen.getByRole("menuitem", { name: /delete/i }));
    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    expect(false).toBe(true);
  });

  it("does not call delete when canceled", async () => {
    render(
      <DeletePaymentMethod
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.click(screen.getByRole("menuitem", { name: /delete/i }));
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(useDeleteUserPaymentMethodById().mutate).not.toBeCalled();
  });

  it("closes the confirmation dialog when canceled or confirmed", async () => {
    render(
      <DeletePaymentMethod
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.click(screen.getByRole("menuitem", { name: /delete/i }));
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("menuitem", { name: /delete/i }));
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});