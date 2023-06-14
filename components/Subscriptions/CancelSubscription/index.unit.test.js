import { getByLabelText, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CancelSubscription from ".";
import { useDeleteSubscriptionById, useUpdateSubscriptionById } from "@/shared/reactQuery/useSubscriptions";

jest.mock("@/shared/reactQuery/useSubscriptions");
jest.mock("@/shared/services/invoices", () => ({
  getUpcomingInvoice: jest.fn().mockReturnValue({
    total: 1000,
  }),
}));

const MINIMAL_PROPS = {
  subscription: {
    id: "subscription-id",
  },
};


describe("CancelSubscription", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("is a menuitem", () => {
    render(
      <CancelSubscription
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("menuitem", { name: /cancel/i })).toBeInTheDocument();
  });

  it("is disabled when mutation is loading", () => {
    useUpdateSubscriptionById.mockReturnValueOnce({ isLoading: true });
    render(
      <CancelSubscription
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("menuitem", { name: /cancel/i })).toHaveAttribute("aria-disabled");
  });

  it("shows a confirmation dialog", async () => {
    render(
      <CancelSubscription
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.click(screen.getByRole("menuitem", { name: /cancel/i }));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("calls update when end of cycle is confirmed", async () => {
    render(
      <CancelSubscription
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.click(screen.getByRole("menuitem", { name: /cancel/i }));
    const radioGroup = await screen.findByRole("radiogroup");
    await userEvent.click(getByLabelText(radioGroup, /at end/i));
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(useUpdateSubscriptionById().mutateAsync).toBeCalledTimes(1);
  });

  it("calls delete when immediate is confirmed", async () => {
    render(
      <CancelSubscription
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.click(screen.getByRole("menuitem", { name: /cancel/i }));
    const radioGroup = await screen.findByRole("radiogroup");
    await userEvent.click(getByLabelText(radioGroup, /immediately/i));
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(useDeleteSubscriptionById().mutateAsync).toBeCalledTimes(1);
  });

  it("does not call update or delete when cancelled", async () => {
    render(
      <CancelSubscription
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.click(screen.getByRole("menuitem", { name: /cancel/i }));
    await userEvent.click(screen.getByRole("button", { name: /back/i }));

    expect(useUpdateSubscriptionById().mutateAsync).not.toBeCalled();
    expect(useDeleteSubscriptionById().mutateAsync).not.toBeCalled();
  });

  it("closes the confirmation dialog when cancelled or confirmed", async () => {
    render(
      <CancelSubscription
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.click(screen.getByRole("menuitem", { name: /cancel/i }));
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: /back/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("menuitem", { name: /cancel/i }));
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});