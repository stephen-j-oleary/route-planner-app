import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CollapseFieldset from ".";
import ThemeProvider from "@/providers/ThemeProvider";


describe("CollapseFieldset", () => {
  it("has a fieldset", () => {
    const title = "Title";
    render(
      <CollapseFieldset
        primary={title}
        disableHideTitle
      >
        <div />
      </CollapseFieldset>,
      { wrapper: ThemeProvider }
    );

    expect(screen.getByRole("group", { name: title })).toBeInTheDocument();
  });

  it("hides title when closed", () => {
    const title = "Title";
    render(
      <CollapseFieldset
        primary={title}
      >
        <div />
      </CollapseFieldset>,
      { wrapper: ThemeProvider }
    );

    expect(screen.queryByText(title, { ignore: "legend" })).not.toBeVisible();
  });

  it("shows title when opened", () => {
    const title = "Title";
    render(
      <CollapseFieldset
        primary={title}
        show
      >
        <div />
      </CollapseFieldset>,
      { wrapper: ThemeProvider }
    );

    expect(screen.queryByText(title, { ignore: "legend" })).toBeVisible();
  });

  it("always shows title when disableHideTitle is passed", () => {
    const title = "Title";
    render(
      <CollapseFieldset
        primary={title}
        disableHideTitle
      >
        <div />
      </CollapseFieldset>,
      { wrapper: ThemeProvider }
    );

    expect(screen.queryByText(title, { ignore: "legend" })).toBeVisible();
  });

  it("has a toggle button", () => {
    render(
      <CollapseFieldset primary="" disableHideTitle>
        <div />
      </CollapseFieldset>,
      { wrapper: ThemeProvider }
    );

    expect(screen.getByRole("button", { name: /show/i })).toBeInTheDocument();
  });

  it("toggle button has the expected text", async () => {
    const title = "Title";
    render(
      <CollapseFieldset
        primary={title}
      >
        <div />
      </CollapseFieldset>,
      { wrapper: ThemeProvider }
    );
    const toggleButton = screen.getByRole("button");

    expect(toggleButton).toHaveTextContent(title);
    await userEvent.click(toggleButton);
    expect(toggleButton).toHaveTextContent(/hide/i);
  });

  it("toggle button has the expected text when disableHideTitle is passed", async () => {
    render(
      <CollapseFieldset primary="" disableHideTitle>
        <div />
      </CollapseFieldset>,
      { wrapper: ThemeProvider }
    );
    const toggleButton = screen.getByRole("button");

    expect(toggleButton).toHaveTextContent(/show/i);
    await userEvent.click(toggleButton);
    expect(toggleButton).toHaveTextContent(/hide/i);
  });

  it("hides the content when closed", () => {
    const CHILD_ID = "child-id";
    render(
      <CollapseFieldset primary="">
        <div data-testid={CHILD_ID} />
      </CollapseFieldset>,
      { wrapper: ThemeProvider }
    );

    expect(screen.queryByTestId(CHILD_ID)).not.toBeInTheDocument();
  });

  it("shows the content when opened", () => {
    const CHILD_ID = "child-id";
    render(
      <CollapseFieldset primary="" show>
        <div data-testid={CHILD_ID} />
      </CollapseFieldset>,
      { wrapper: ThemeProvider }
    );

    expect(screen.getByTestId(CHILD_ID)).toBeInTheDocument();
  });

  it("handles uncontrolled show state", async () => {
    const CHILD_ID = "child-id";
    render(
      <CollapseFieldset primary="" defaultShow>
        <div data-testid={CHILD_ID} />
      </CollapseFieldset>,
      { wrapper: ThemeProvider }
    );

    expect(screen.getByTestId(CHILD_ID)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(screen.queryByTestId(CHILD_ID)).not.toBeInTheDocument();
    });
  });

  it("calls onToggle when show state is controlled", async () => {
    const onToggle = jest.fn();
    render(
      <CollapseFieldset
        primary=""
        show={false}
        onToggle={onToggle}
      >
        <div />
      </CollapseFieldset>,
      { wrapper: ThemeProvider }
    );

    await userEvent.click(screen.getByRole("button"));
    expect(onToggle).toBeCalledTimes(1);
  });

  it("does not call onToggle when show state is uncontrolled", async () => {
    const onToggle = jest.fn();
    render(
      <CollapseFieldset
        primary=""
        onToggle={onToggle}
      >
        <div />
      </CollapseFieldset>,
      { wrapper: ThemeProvider }
    );

    await userEvent.click(screen.getByRole("button"));
    expect(onToggle).toBeCalledTimes(0);
  });

  it("has the expected primary value", () => {
    const primary = "Primary";
    render(
      <CollapseFieldset
        primary={primary}
      >
        <div />
      </CollapseFieldset>,
      { wrapper: ThemeProvider }
    );

    expect(screen.getByText(primary, { ignore: "legend" })).toBeInTheDocument();
  });

  it("has the expected secondary value", () => {
    const secondary = "Secondary";
    render(
      <CollapseFieldset
        primary=""
        secondary={secondary}
      >
        <div />
      </CollapseFieldset>,
      { wrapper: ThemeProvider }
    );

    expect(screen.getByText(secondary)).toBeInTheDocument();
  });
});