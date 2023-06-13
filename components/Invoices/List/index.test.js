import { render, screen } from "@testing-library/react";

import InvoicesList from ".";
import useLoadMore from "@/shared/hooks/useLoadMore";

const LIST_ITEM_ID = "list-item-id";
jest.mock("@/components/Invoices/ListItem", () => (
  function ListItemMock() {
    return <tr data-testid={LIST_ITEM_ID} />;
  }
));
jest.mock("@/shared/hooks/useLoadMore");

const MINIMAL_PROPS = {
  data: [{}, {}, {}, {}],
};


describe("InvoicesList", () => {
  afterEach(jest.clearAllMocks);

  it("has a table", () => {
    render(
      <InvoicesList
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("has a listitem", () => {
    render(
      <InvoicesList
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getAllByTestId(LIST_ITEM_ID).length).toBeGreaterThan(0);
  });

  it("limits data length", () => {
    const VISIBLE = 2;
    render(
      <InvoicesList
        {...MINIMAL_PROPS}
        visible={VISIBLE}
      />
    );


    expect(useLoadMore).toBeCalledWith(expect.any(Array), VISIBLE);
  });

  it("has a show more button when more data available", () => {
    render(
      <InvoicesList
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("button", { name: /increment/i })).toBeInTheDocument();
  });

  it("has an empty state", () => {
    render(
      <InvoicesList
        {...MINIMAL_PROPS}
        data={[]}
      />
    );

    expect(screen.getByText(/no invoices found/i)).toBeInTheDocument();
  });

  it("has an error state", () => {
    render(
      <InvoicesList
        {...MINIMAL_PROPS}
        error
      />
    );

    expect(screen.getByText(/invoices could not be loaded/i)).toBeInTheDocument();
  });
});