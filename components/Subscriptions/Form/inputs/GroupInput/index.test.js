import { render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";

import SubscriptionFormGroupInput from ".";

jest.mock(
  "@/components/Subscriptions/Form/Product/PlanGroupTitle",
  () => (
    function PlanGroupTitleMock() {
      return <div data-testid="plan-group-title-mock" />;
    }
  )
);

const MINIMAL_PROPS = {
  name: "group",
  products: { isSuccess: true },
  groupOptions: {
    "Plan 1": [],
    "Plan 2": [],
  },
};


function setupForm() {
  const { result } = renderHook(() => useForm());
  return result.current;
}

describe("SubscriptionFormGroupInput", () => {
  it("is a radiogroup", () => {
    const form = setupForm();
    render(
      <SubscriptionFormGroupInput
        form={form}
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
  });

  it("shows the plan group title", () => {
    const form = setupForm();
    render(
      <SubscriptionFormGroupInput
        form={form}
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getAllByTestId("plan-group-title-mock")).toHaveLength(2);
  });

  it("handles changing selected value", async () => {
    const form = setupForm();
    render(
      <SubscriptionFormGroupInput
        form={form}
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.click(screen.getByRole("radiogroup").firstChild);
    waitFor(() => {
      expect(form.getValues("group")).toBe("Plan 1");
    });

    await userEvent.click(screen.getByRole("radiogroup").lastChild);
    waitFor(() => {
      expect(form.getValues("group")).toBe("Plan 2");
    });
  });
});