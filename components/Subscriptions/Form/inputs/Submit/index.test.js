import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SubscriptionFormSubmit from ".";

const MINIMAL_PROPS = {
  submitText: "Submit button text",
};


describe("SubscriptionFormSubmit", () => {
  it("is a button", () => {
    render(
      <SubscriptionFormSubmit
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("has the passed submitText", () => {
    render(
      <SubscriptionFormSubmit
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("button", { name: MINIMAL_PROPS.submitText })).toBeInTheDocument();
  });

  it("has the passed tooltipText", async () => {
    const TOOLTIP_TEXT = "Tooltip text";
    render(
      <SubscriptionFormSubmit
        {...MINIMAL_PROPS}
        tooltipText={TOOLTIP_TEXT}
      />
    );

    await userEvent.hover(screen.getByRole("button", { name: MINIMAL_PROPS.submitText }));
    await waitFor(() => {
      expect(screen.getByRole("tooltip", { name: TOOLTIP_TEXT })).toBeInTheDocument();
    });
  });

  it("has no tooltip when no tooltipText is passed", async () => {
    render(
      <SubscriptionFormSubmit
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.hover(screen.getByRole("button", { name: MINIMAL_PROPS.submitText }));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("shows tooltip when button is disabled or loading", async () => {
    const TOOLTIP_TEXT = "Tooltip text";
    render(
      <SubscriptionFormSubmit
        {...MINIMAL_PROPS}
        tooltipText={TOOLTIP_TEXT}
        loading
      />
    );

    await userEvent.hover(screen.getByRole("button", { name: MINIMAL_PROPS.submitText }).parentElement);
    await waitFor(() => {
      expect(screen.getByRole("tooltip", { name: TOOLTIP_TEXT })).toBeInTheDocument();
    });
  });
});