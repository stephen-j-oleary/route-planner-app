jest.mock("@/shared/reactQuery/useSubscriptions");
jest.mock("@/shared/services/invoices", () => ({
  getUpcomingInvoice: jest.fn().mockReturnValue({
    total: 1000,
  }),
}));

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CancelSubscription from ".";
import { useCancelSubscriptionAtPeriodEndById, useCancelSubscriptionById } from "@/reactQuery/useSubscriptions";

const mockedUseCancelSubscriptionById = useCancelSubscriptionById as jest.Mock;
const mockedUseCancelSubscriptionAtPeriodEndById = useCancelSubscriptionAtPeriodEndById as jest.Mock;


describe("CancelSubscription", () => {
  const subscription = {
    id: "subscription-id",
    status: "active" as const,
    current_period_end: 10,
  };

  afterEach(() => jest.clearAllMocks());

  it("is a menuitem", () => {
    render(
      <CancelSubscription
        subscription={subscription}
      />
    );

    expect(screen.getByRole("menuitem", { name: /cancel/i })).toBeInTheDocument();
  });

  it("is disabled when mutation is loading", () => {
    mockedUseCancelSubscriptionAtPeriodEndById.mockReturnValueOnce({ isLoading: true });
    render(
      <CancelSubscription
        subscription={subscription}
      />
    );

    expect(screen.getByRole("menuitem", { name: /cancel/i })).toHaveAttribute("aria-disabled");
  });

  it("shows a confirmation dialog", async () => {
    render(
      <CancelSubscription
        subscription={subscription}
      />
    );

    await userEvent.click(screen.getByRole("menuitem", { name: /cancel/i }));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("cancels at end of cycle when possible", async () => {
    render(
      <CancelSubscription
        subscription={subscription}
      />
    );

    await userEvent.click(screen.getByRole("menuitem", { name: /cancel/i }));
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(mockedUseCancelSubscriptionAtPeriodEndById().mutate).toHaveBeenCalledTimes(1);
  });

  it("cancels immediately when subscription is inactive", async () => {
    render(
      <CancelSubscription
        subscription={{
          ...subscription,
          status: "incomplete" as const,
        }}
      />
    );

    await userEvent.click(screen.getByRole("menuitem", { name: /cancel/i }));
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(mockedUseCancelSubscriptionById().mutate).toHaveBeenCalledTimes(1);
  });

  it("does not cancel subscription when modal is dismissed", async () => {
    render(
      <CancelSubscription
        subscription={subscription}
      />
    );

    await userEvent.click(screen.getByRole("menuitem", { name: /cancel/i }));
    await userEvent.click(screen.getByRole("button", { name: /back/i }));

    expect(mockedUseCancelSubscriptionById().mutateAsync).not.toHaveBeenCalled();
    expect(mockedUseCancelSubscriptionAtPeriodEndById().mutateAsync).not.toHaveBeenCalled();
  });

  it("closes the confirmation dialog when canceled or confirmed", async () => {
    render(
      <CancelSubscription
        subscription={subscription}
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