import { render, screen } from "@testing-library/react";

import PageSection from ".";

const SECTION_ID = "section-id";
const MINIMAL_PROPS = {
  "data-testid": SECTION_ID,
};


describe("PageSection", () => {
  it("has no paper by default", () => {
    render(
      <PageSection
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByTestId(SECTION_ID)).not.toHaveClass("MuiPaper-root");
  });

  it("has a paper when paper is passed", () => {
    render(
      <PageSection
        paper
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByTestId(SECTION_ID).firstChild).toHaveClass("MuiPaper-root");
  });

  it("has no borders by default", () => {
    render(
      <PageSection
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByTestId(SECTION_ID)).toHaveStyle({ "border-top-width": 0 });
  });

  it("handles borders true", () => {
    render(
      <PageSection
        borders
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByTestId(SECTION_ID)).toHaveStyle({
      "border-top-width": "1px",
      "border-right-width": "1px",
      "border-bottom-width": "1px",
      "border-left-width": "1px",
    });
  });

  it("handles borders string", () => {
    render(
      <PageSection
        borders="top right"
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByTestId(SECTION_ID)).toHaveStyle({
      "border-top-width": "1px",
      "border-right-width": "1px",
    });
  });

  it("has top padding by default", () => {
    render(
      <PageSection
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByTestId(SECTION_ID)).toHaveStyle({ "padding-top": "16px" });
  });

  it("has no top padding when top is true", () => {
    render(
      <PageSection
        isTop
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByTestId(SECTION_ID)).toHaveStyle({ "padding-top": 0 });
  });

  it("has the passed title", () => {
    const title = "Title";
    render(
      <PageSection
        title={title}
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("heading")).toHaveTextContent(title);
  });

  it("title is a link when titleHref is passed", () => {
    const title = "Title";
    const titleHref = "title-href";
    render(
      <PageSection
        title={title}
        titleHref={titleHref}
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("link", { name: title })).toHaveTextContent(title);
  });

  it("has the passed action", () => {
    const ACTION_ID = "action-id";
    render(
      <PageSection
        action={<div data-testid={ACTION_ID} />}
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByTestId(ACTION_ID)).toBeInTheDocument();
  });

  it("has the passed children", () => {
    const CHILD_ID = "child-id";
    render(
      <PageSection
        {...MINIMAL_PROPS}
      >
        <div data-testid={CHILD_ID} />
      </PageSection>
    );

    expect(screen.getByTestId(CHILD_ID)).toBeInTheDocument();
  });

  it("has the passed body when no children are passed", () => {
    const BODY_ID = "body-id";
    render(
      <PageSection
        body={<div data-testid={BODY_ID} />}
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByTestId(BODY_ID)).toBeInTheDocument();
  });

  it("ignores the body when children are passed", () => {
    const BODY_ID = "body-id";
    const CHILD_ID = "child-id";
    render(
      <PageSection
        body={<div data-testid={BODY_ID} />}
        {...MINIMAL_PROPS}
      >
        <div data-testid={CHILD_ID} />
      </PageSection>
    );

    expect(screen.getByTestId(CHILD_ID)).toBeInTheDocument();
    expect(screen.queryByTestId(BODY_ID)).not.toBeInTheDocument();
  });
});