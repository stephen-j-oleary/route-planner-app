import { render, screen } from "@testing-library/react";

import PageHeading from ".";

const BREADCRUMBS_ID = "breadcrumbs-id";

jest.mock("@/components/NextBreadcrumbs", () => (
  function BreadcrumbsMock() {
    return <div data-testid={BREADCRUMBS_ID} />;
  }
));


describe("PageHeading", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("has the passed heading", () => {
    const title = "Title text";
    render(
      <PageHeading
        title={title}
      />
    );

    expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
  });

  it("has the default heading level", () => {
    render(<PageHeading />);

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("has the passed heading level", () => {
    render(
      <PageHeading
        titleComponent="h2"
      />
    );

    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("has the passed actions", () => {
    const ACTION_ID = "action-id";
    render(
      <PageHeading
        action={<div data-testid={ACTION_ID} />}
      />
    );

    expect(screen.getByTestId(ACTION_ID)).toBeInTheDocument();
  });

  it("has breadcrumbs", () => {
    render(<PageHeading />);

    expect(screen.getByTestId(BREADCRUMBS_ID)).toBeInTheDocument();
  });
});