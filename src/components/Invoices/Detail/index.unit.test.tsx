import { render, screen } from "@testing-library/react";
import moment from "moment";
import Stripe from "stripe";

import InvoiceDetails from ".";

const MINIMAL_PROPS = {
  query: {
    data: {
      period_start: moment().unix(),
      period_end: moment().unix(),
      lines: {
        data: [{
          id: 1,
          description: "line description",
          amount: 1000,
        }],
        has_more: false,
        object: "list" as const,
        url: "",
      },
      subtotal: 1000,
      total: 1000,
      starting_balance: 1000,
      amount_due: 1000,
    } as unknown as Stripe.Invoice,
  },
};


describe("InvoiceDetails", () => {
  it("has a table", () => {
    render(
      <InvoiceDetails
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("has the expected table head", () => {
    render(
      <InvoiceDetails
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("row", { name: /description quantity unit price amount/i })).toBeInTheDocument();
  });

  it("has the invoice date range", () => {
    render(
      <InvoiceDetails
        {...MINIMAL_PROPS}
      />
    );

    // Matches date ranges of the format MMM D, YYYY - MMM D, YYYY or MMM D - MMM D, YYYY
    const name = /[a-zA-Z]{3} [1-3]?[1-9](, \d{4})? - [a-zA-Z]{3} [1-3]?[1-9], \d{4}/;
    expect(screen.getByRole("row", { name })).toBeInTheDocument();
  });

  it("has the invoice lines", () => {
    render(
      <InvoiceDetails
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("row", { name: /^line description/i })).toBeInTheDocument();
  });

  it("has the invoice subtotal", () => {
    render(
      <InvoiceDetails
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("row", { name: /^subtotal/i })).toBeInTheDocument();
  });

  it("has the invoice total", () => {
    render(
      <InvoiceDetails
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("row", { name: /^total/i })).toBeInTheDocument();
  });

  it("has an error when error prop is passed", () => {
    render(
      <InvoiceDetails
        {...MINIMAL_PROPS}
        query={{ data: undefined, error: new Error() }}
      />
    );

    expect(screen.getByText(/invoice could not be loaded/i)).toBeInTheDocument();
  });
});