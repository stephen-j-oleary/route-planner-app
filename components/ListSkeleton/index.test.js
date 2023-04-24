import { render, screen } from "@testing-library/react";

import ListSkeleton from ".";

const DEFAULT_ROWS = 3;
const DEFAULT_COLS = 1;


describe("ListSkeleton", () => {
  it("has a list", () => {
    render(<ListSkeleton />);

    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("has the default number of rows", () => {
    render(<ListSkeleton />);

    expect(screen.getAllByRole("listitem")).toHaveLength(DEFAULT_ROWS);
  });

  it("has the default number of columns", () => {
    render(<ListSkeleton />);

    screen.getAllByRole("listitem").forEach(item => {
      expect(item.childNodes).toHaveLength(DEFAULT_COLS);
    });
  });

  it("has the passed number of rows", () => {
    const rows = 4;
    render(
      <ListSkeleton
        rows={rows}
      />
    );

    expect(screen.getAllByRole("listitem")).toHaveLength(rows);
  });

  it("has the passed number of columns", () => {
    const cols = 2;
    render(
      <ListSkeleton
        cols={cols}
      />
    );

    screen.getAllByRole("listitem").forEach(item => {
      expect(item.childNodes).toHaveLength(cols);
    });
  });

  it("has a primary and secondary skeleton when not passed disableSecondary", () => {
    render(<ListSkeleton />);

    screen.getAllByRole("listitem").forEach(row => {
      row.childNodes.forEach(col => {
        expect(col.childNodes).toHaveLength(2);
      });
    });
  });

  it("has only a primary skeleton when passed disableSecondary", () => {
    render(
      <ListSkeleton disableSecondary />
    );

    screen.getAllByRole("listitem").forEach(row => {
      row.childNodes.forEach(col => {
        expect(col.childNodes).toHaveLength(1);
      });
    });
  });

  it("has the passed renderCol", () => {
    const rows = 3;
    const COL_ID = "col-id";
    render(
      <ListSkeleton
        rows={rows}
        renderCol={i => <div key={i} data-testid={COL_ID} />}
      />
    );

    expect(screen.getAllByTestId(COL_ID)).toHaveLength(rows);
  });

  it("has the passed renderPrimary", () => {
    const rows = 3;
    const PRIMARY_ID = "primary-id";
    render(
      <ListSkeleton
        rows={rows}
        renderPrimary={() => <span data-testid={PRIMARY_ID} />}
      />
    );

    expect(screen.getAllByTestId(PRIMARY_ID)).toHaveLength(rows);
  });

  it("has the passed renderSecondary", () => {
    const rows = 3;
    const SECONDARY_ID = "secondary-id";
    render(
      <ListSkeleton
        rows={rows}
        renderSecondary={() => <span data-testid={SECONDARY_ID} />}
      />
    );

    expect(screen.getAllByTestId(SECONDARY_ID)).toHaveLength(rows);
  });
});