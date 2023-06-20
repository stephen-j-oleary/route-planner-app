import { render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";

import SubscriptionFormProductInput from ".";

jest.mock(
  "@/components/Subscriptions/Form/Product/PlanProductTitle",
  () => (
    function PlanProductTitleMock() {
      return <div data-testid="plan-product-title-mock" />;
    }
  )
);

const MINIMAL_PROPS = {
  name: "product",
  products: { isSuccess: true },
  checkIsProductSubscribed: jest.fn().mockReturnValue(false),
  productOptions: [
    { id: "prod-1" },
    { id: "prod-2" },
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
      <SubscriptionFormProductInput
        form={form}
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
  });

  it("shows the plan product title", () => {
    const form = setupForm();
    render(
      <SubscriptionFormProductInput
        form={form}
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getAllByTestId("plan-product-title-mock")).toHaveLength(2);
  });

  it("shows a current plan tag if product is subscribed", () => {
    MINIMAL_PROPS.checkIsProductSubscribed.mockReturnValueOnce(true);
    const form = setupForm();
    render(
      <SubscriptionFormProductInput
        form={form}
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByText(/current plan/i)).toBeInTheDocument();
  });

  it("handles changing selected value", async () => {
    const form = setupForm();
    render(
      <SubscriptionFormProductInput
        form={form}
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.click(screen.getByRole("radiogroup").firstChild);
    waitFor(() => {
      expect(form.getValues("product")).toBe("prod-1");
    });

    await userEvent.click(screen.getByRole("radiogroup").lastChild);
    waitFor(() => {
      expect(form.getValues("product")).toBe("prod-2");
    });
  });
});