import { render, screen } from "@testing-library/react";

import TableSkeleton from ".";

const DEFAULT_ROWS = 3;
const DEFAULT_COLS = 1;


describe("TableSkeleton", () => {
  it("has a table", () => {
    render(<TableSkeleton />);

    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("has the default number of rows", () => {
    render(<TableSkeleton />);

    expect(screen.getAllByRole("row")).toHaveLength(DEFAULT_ROWS);
  });

  it("has the default number of columns", () => {
    render(<TableSkeleton />);

    screen.getAllByRole("row").forEach(item => {
      expect(item.childNodes).toHaveLength(DEFAULT_COLS);
    });
  });

  it("has the passed number of rows", () => {
    const rows = 4;
    render(
      <TableSkeleton
        rows={rows}
      />
    );

    expect(screen.getAllByRole("row")).toHaveLength(rows);
  });

  it("has the passed number of columns", () => {
    const cols = 2;
    render(
      <TableSkeleton
        cols={cols}
      />
    );

    screen.getAllByRole("row").forEach(item => {
      expect(item.childNodes).toHaveLength(cols);
    });
  });

  it("has a primary and secondary skeleton when not passed disableSecondary", () => {
    render(<TableSkeleton />);

    screen.getAllByRole("row").forEach(row => {
      row.childNodes.forEach(col => {
        expect(col.childNodes).toHaveLength(2);
      });
    });
  });

  it("has only a primary skeleton when passed disableSecondary", () => {
    render(
      <TableSkeleton disableSecondary />
    );

    screen.getAllByRole("row").forEach(row => {
      row.childNodes.forEach(col => {
        expect(col.childNodes).toHaveLength(1);
      });
    });
  });

  it("has the passed renderCol", () => {
    const rows = 3;
    const COL_ID = "col-id";
    render(
      <TableSkeleton
        rows={rows}
        renderCol={i => <td key={i} data-testid={COL_ID} />}
      />
    );

    expect(screen.getAllByTestId(COL_ID)).toHaveLength(rows);
  });

  it("has the passed renderPrimary", () => {
    const rows = 3;
    const PRIMARY_ID = "primary-id";
    render(
      <TableSkeleton
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
      <TableSkeleton
        rows={rows}
        renderSecondary={() => <span data-testid={SECONDARY_ID} />}
      />
    );

    expect(screen.getAllByTestId(SECONDARY_ID)).toHaveLength(rows);
  });
});