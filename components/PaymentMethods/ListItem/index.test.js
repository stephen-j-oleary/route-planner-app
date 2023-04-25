import { render, screen } from "@testing-library/react";

import PaymentMethodsListItem from ".";

const BRAND = "brand";
const LAST_4 = "last4";
const EXP_MONTH = "04";
const EXP_YEAR = "24";
const MINIMAL_PROPS = {
  item: {
    type: "card",
    card: {
      brand: BRAND,
      last4: LAST_4,
      exp_month: EXP_MONTH,
      exp_year: EXP_YEAR,
    },
  },
};


describe("PaymentMethodsListItem", () => {
  it("is a listitem", () => {
    render(
      <PaymentMethodsListItem
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("listitem")).toBeInTheDocument();
  });

  it("has the card brand and last four", () => {
    render(
      <PaymentMethodsListItem
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByText(RegExp(BRAND, "i"))).toBeInTheDocument();
    expect(screen.getByText(/\*{4}/)).toBeInTheDocument();
    expect(screen.getByText(RegExp(LAST_4, "i"))).toBeInTheDocument();
  });

  it("has the card expiry", () => {
    render(
      <PaymentMethodsListItem
        {...MINIMAL_PROPS}
      />
    );

    const text = RegExp(`^expires ${EXP_MONTH}/${EXP_YEAR}$`, "i");
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it("has actions", () => {
    render(
      <PaymentMethodsListItem
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});