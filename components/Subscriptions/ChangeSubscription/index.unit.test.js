import { render, screen } from "@testing-library/react";

import ChangeSubscription from ".";

const SUBSCRIPTION_ID = "subscription-id";
const MINIMAL_PROPS = {
  subscription: {
    id: SUBSCRIPTION_ID,
  },
};


describe("ChangeSubscription", () => {
  it("is a menuitem", () => {
    render(
      <ChangeSubscription
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("menuitem", { name: /change subscription/i })).toBeInTheDocument();
  });

  it("links to the manage subscription page", () => {
    render(
      <ChangeSubscription
        {...MINIMAL_PROPS}
      />
    );

    const href = "/account/subscriptions/manage";
    expect(screen.getByRole("menuitem")).toHaveAttribute("href", href);
  });
});