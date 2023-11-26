import { render, screen } from "@testing-library/react";

import Component from ".";
import { useGetSubscriptions } from "@/shared/reactQuery/useSubscriptions";


const MINIMAL_PROPS = {
  price: "price_id",
};

describe("CheckoutForm", () => {
  it("shows loading indicator when loading subscriptions", () => {
    useGetSubscriptions.mockReturnValueOnce({ isLoading: true });
    render(<Component {...MINIMAL_PROPS} />);

    expect(screen.getByRole("progressbar")).toBeVisible();
  });

  it("shows notification when user has subscription", () => {
    useGetSubscriptions.mockReturnValueOnce({ isLoading: false, data: [{}] });
    render(<Component {...MINIMAL_PROPS} />);

    expect(screen.getByText(/already have a subscription/i)).toBeVisible();
  });
});