import { render, screen } from "@testing-library/react";

import PaymentMethodsList from ".";
import useLoadMore from "@/hooks/useLoadMore";

jest.mock("@/shared/hooks/useLoadMore");

const MINIMAL_PROPS = {
  data: [{}, {}, {}, {}],
};


describe("PaymentMethodsList", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("has a list", () => {
    render(
      <PaymentMethodsList
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("has a listitem", () => {
    render(
      <PaymentMethodsList
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getAllByRole("listitem").length).toBeGreaterThan(0);
  });

  it("limits data length", () => {
    const VISIBLE = 2;
    render(
      <PaymentMethodsList
        {...MINIMAL_PROPS}
        visible={VISIBLE}
      />
    );


    expect(useLoadMore).toBeCalledWith(expect.any(Array), VISIBLE);
  });

  it("has a show more button when more data available", () => {
    render(
      <PaymentMethodsList
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("button", { name: /increment/i })).toBeInTheDocument();
  });

  it("has an empty state", () => {
    render(
      <PaymentMethodsList
        {...MINIMAL_PROPS}
        data={[]}
      />
    );

    expect(screen.getByText(/no payment methods found/i)).toBeInTheDocument();
  });

  it("has an error state", () => {
    render(
      <PaymentMethodsList
        {...MINIMAL_PROPS}
        error
      />
    );

    expect(screen.getByText(/payment methods could not be loaded/i)).toBeInTheDocument();
  });
});