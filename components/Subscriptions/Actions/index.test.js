import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SubscriptionActions } from ".";

const MINIMAL_PROPS = {
  subscription: {},
};
const SCHEDULED_TO_CANCEL = {
  subscription: { cancel_at_period_end: true },
};


describe("SubscriptionActions", () => {
  it("has a toggle button", () => {
    render(
      <SubscriptionActions
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("toggles a menu on click", async () => {
    render(
      <SubscriptionActions
        {...MINIMAL_PROPS}
      />
    );
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

  it("has a change action when subscription is not scheduled to cancel", async () => {
    render(
      <SubscriptionActions
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });
    expect(screen.getByRole("menuitem", { name: /change/i })).toBeInTheDocument();
  });

  it("does not have a change action when subscription is scheduled to cancel", async () => {
    render(
      <SubscriptionActions
        {...MINIMAL_PROPS}
        {...SCHEDULED_TO_CANCEL}
      />
    );

    await userEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });
    expect(screen.queryByRole("menuitem", { name: /change/i })).not.toBeInTheDocument();
  });

  it("has a renew action when subscription is scheduled to cancel", async () => {
    render(
      <SubscriptionActions
        {...MINIMAL_PROPS}
        {...SCHEDULED_TO_CANCEL}
      />
    );

    await userEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });
    expect(screen.getByRole("menuitem", { name: /renew/i })).toBeInTheDocument();
  });

  it("does not have a renew action when subscription is not scheduled to cancel", async () => {
    render(
      <SubscriptionActions
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });
    expect(screen.queryByRole("menuitem", { name: /renew/i })).not.toBeInTheDocument();
  });

  it("has a cancel action", async () => {
    render(
      <SubscriptionActions
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });
    expect(screen.getByRole("menuitem", { name: /cancel/i })).toBeInTheDocument();
  });
});