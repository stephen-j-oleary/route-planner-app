import { render, screen } from "@testing-library/react";
import moment from "moment";
import Stripe from "stripe";

import ListItem from ".";
import { useGetProducts } from "@/reactQuery/useProducts";
import createUseQueryMock from "__utils__/createUseQueryMock";

jest.mock("@/reactQuery/useProducts");

const mockedUseGetProducts = useGetProducts as jest.Mock;

const PRODUCT_ID = "product-id";
const STATUS = "Status";
const MINIMAL_PROPS = {
  item: {
    lines: {
      data: [{ price: { product: PRODUCT_ID } }],
    },
    hosted_invoice_url: "hosted-invoice",
    period_end: moment().unix(),
    total: 1000,
    status: STATUS,
  } as unknown as Stripe.Invoice,
};

function setupContainer() {
  const table = document.createElement("table");
  const tbody = document.createElement("tbody");
  table.appendChild(tbody);
  return document.body.appendChild(tbody);
}


describe("InvoicesListItem", () => {
  it("has a row", () => {
    const container = setupContainer();
    render(
      <ListItem
        {...MINIMAL_PROPS}
      />,
      { container }
    );

    expect(screen.getByRole("row")).toBeInTheDocument();
  });

  it("passes props to the row", () => {
    const container = setupContainer();
    const PROP_TO_PASS = "prop-to-pass";
    render(
      <ListItem
        {...MINIMAL_PROPS}
        data-proptopass={PROP_TO_PASS}
      />,
      { container }
    );

    expect(screen.getByRole("row")).toHaveAttribute("data-proptopass", PROP_TO_PASS);
  });

  it("has a link to the hosted invoice", () => {
    const container = setupContainer();
    render(
      <ListItem
        {...MINIMAL_PROPS}
      />,
      { container }
    );

    const name = /[a-zA-Z]{3} [1-3]?[1-9][a-z]{2}, \d{4}/; // Match date format MMM Do, YYYY
    expect(screen.getByRole("link", { name })).toBeInTheDocument();
  });

  it("selects the correct product", () => {
    const container = setupContainer();
    render(
      <ListItem
        {...MINIMAL_PROPS}
      />,
      { container }
    );

    expect(useGetProducts).toBeCalledWith(
      expect.objectContaining({ select: expect.any(Function) })
    );
  });

  it("has the product name", () => {
    const container = setupContainer();
    const PRODUCT_NAME = "product-name";
    mockedUseGetProducts.mockReturnValueOnce(createUseQueryMock("success", {
      data: {
        id: PRODUCT_ID,
        name: PRODUCT_NAME,
      },
    })());
    render(
      <ListItem
        {...MINIMAL_PROPS}
      />,
      { container }
    );

    expect(screen.getByText(PRODUCT_NAME)).toBeInTheDocument();
  });

  it("has the item total", () => {
    const container = setupContainer();
    render(
      <ListItem
        {...MINIMAL_PROPS}
      />,
      { container }
    );

    const text = /^\$\d+(\.\d{2})?/; // Match strings starting with $ followed by a whole number or decimal
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it("has the item status", () => {
    const container = setupContainer();
    render(
      <ListItem
        {...MINIMAL_PROPS}
      />,
      { container }
    );

    expect(screen.getByText(STATUS)).toBeInTheDocument();
  });
});