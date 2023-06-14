import { render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";

import SubscriptionFormPriceInput from ".";

jest.mock(
  "@/components/Subscriptions/Form/Price/PriceTitle",
  () => (
    function PriceTitleMock() {
      return <div data-testid="price-title-mock" />;
    }
  )
);

jest.mock(
  "@/components/Subscriptions/Form/Price/PriceOverview",
  () => (
    function PriceOverviewMock() {
      return <div data-testid="price-overview-mock" />;
    }
  )
);

const MINIMAL_PROPS = {
  name: "price",
  prices: { isSuccess: true },
  priceOptions: [
    { id: "price-1" },
    { id: "price-2" },
  ],
};


function setupForm() {
  const { result } = renderHook(() => useForm());
  return result.current;
}

describe("SubscriptionFormProductInput", () => {
  it("is a radiogroup", () => {
    const form = setupForm();
    render(
      <SubscriptionFormPriceInput
        form={form}
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
  });

  it("shows the price title", () => {
    const form = setupForm();
    render(
      <SubscriptionFormPriceInput
        form={form}
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getAllByTestId("price-title-mock")).toHaveLength(2);
  });

  it("shows the price overview", () => {
    const form = setupForm();
    render(
      <SubscriptionFormPriceInput
        form={form}
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getAllByTestId("price-overview-mock")).toHaveLength(2);
  });

  it("handles changing selected value", async () => {
    const form = setupForm();
    render(
      <SubscriptionFormPriceInput
        form={form}
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.click(screen.getByRole("radiogroup").firstChild);
    waitFor(() => {
      expect(form.getValues("price")).toBe("price-1");
    });

    await userEvent.click(screen.getByRole("radiogroup").lastChild);
    waitFor(() => {
      expect(form.getValues("price")).toBe("price-2");
    });
  });
});