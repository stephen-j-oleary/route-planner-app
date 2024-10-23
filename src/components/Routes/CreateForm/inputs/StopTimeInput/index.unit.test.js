import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import StopTimeInput from ".";

const MINIMAL_PROPS = {
  name: "stopTime",
};


describe("CreateRouteFormStopTimeInput", () => {
  it("is a number input", () => {
    render(
      <StopTimeInput
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
  });

  it("has a min value of 0", () => {
    render(
      <StopTimeInput
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("spinbutton")).toHaveAttribute("min", "0");
  });

  it("only allows number input", async () => {
    render(
      <StopTimeInput
        {...MINIMAL_PROPS}
      />
    );
    const input = screen.getByRole("spinbutton");

    await userEvent.type(input, "abc");

    expect(input).toHaveValue(0);
  });

  it("handles changes", async () => {
    render(
      <StopTimeInput
        {...MINIMAL_PROPS}
      />
    );
    const input = screen.getByRole("spinbutton");

    await userEvent.type(input, "10");

    expect(input).toHaveValue(10);
  });

  it("has a tooltip with a field description", async () => {
    render(
      <StopTimeInput
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.hover(screen.getByRole("spinbutton"));

    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });
  })
});