jest.mock("@/components/CheckoutForm/useCheckoutLogic", () => jest.fn());
jest.mock("@/components/CheckoutForm/ChangeSubscription", () => jest.fn());
jest.mock("@/components/CheckoutForm/NewSubscription", () => jest.fn());

import { render, screen } from "@testing-library/react";

import Component from ".";
import CheckoutFormChangeSubscription from "@/components/CheckoutForm/ChangeSubscription";
import CheckoutFormNewSubscription from "@/components/CheckoutForm/NewSubscription";
import useCheckoutLogic from "@/components/CheckoutForm/useCheckoutLogic";
import QueryClientProvider from "@/providers/QueryClientProvider";

const mockedUseCheckoutLogic = useCheckoutLogic as jest.Mock;
const mockedCheckoutFormChangeSubscription = CheckoutFormChangeSubscription as jest.Mock;
const mockedCheckoutFormNewSubscription = CheckoutFormNewSubscription as jest.Mock;


const PROPS = {
  priceId: "price_id",
};

const wrapper = QueryClientProvider;

describe("CheckoutForm", () => {
  afterEach(() => jest.clearAllMocks());

  it("shows loading state", () => {
    mockedUseCheckoutLogic.mockReturnValueOnce({ state: "loading" });
    render(<Component {...PROPS} />, { wrapper });

    expect(screen.getByRole("form", { busy: true })).toBeVisible();
  })

  it("shows error state", () => {
    mockedUseCheckoutLogic.mockReturnValueOnce({ state: "error" });
    render(<Component {...PROPS} />, { wrapper });

    expect(screen.getByText(/failed to load/i)).toBeVisible();
  })

  it("shows change state", () => {
    const subscriptions = [{ id: "sub1" }];
    const price = { id: "price1" };
    mockedUseCheckoutLogic.mockReturnValueOnce({ state: "change", subscriptions, price });
    render(<Component {...PROPS} />, { wrapper });

    expect(mockedCheckoutFormChangeSubscription).toHaveBeenCalledWith(
      expect.objectContaining({
        activeSubscriptions: subscriptions,
        newPrice: price,
      }),
      expect.anything()
    );
  })

  it("shows subscribe state", () => {
    const price = { id: "price1" };
    mockedUseCheckoutLogic.mockReturnValueOnce({ state: "subscribe", price });
    render(<Component {...PROPS} />, { wrapper });

    expect(mockedCheckoutFormNewSubscription).toHaveBeenCalledWith(
      expect.objectContaining({
        newPrice: price,
      }),
      expect.anything()
    );
  })
})