import { render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";

import StopTimeInput from ".";

const MINIMAL_PROPS = {
  name: "stopTime",
};


function setupForm() {
  const { result } = renderHook(() => useForm({ defaultValues: { stopTime: 0 } }));
  return result.current;
}

describe("CreateRouteFormStopTimeInput", () => {
  it("is a number input", () => {
    const form = setupForm();
    render(
      <StopTimeInput
        form={form}
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
  });

  it("has a min value of 0", () => {
    const form = setupForm();
    render(
      <StopTimeInput
        form={form}
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("spinbutton")).toHaveAttribute("min", "0");
  });

  it("only allows number input", async () => {
    const form = setupForm();
    render(
      <StopTimeInput
        form={form}
        {...MINIMAL_PROPS}
      />
    );
    const input = screen.getByRole("spinbutton");

    await userEvent.type(input, "abc");

    expect(input).toHaveValue(0);
  });

  it("handles changes", async () => {
    const form = setupForm();
    render(
      <StopTimeInput
        form={form}
        {...MINIMAL_PROPS}
      />
    );
    const input = screen.getByRole("spinbutton");

    await userEvent.type(input, "10");

    expect(input).toHaveValue(10);
  });

  it("has a tooltip with a field description", async () => {
    const form = setupForm();
    render(
      <StopTimeInput
        form={form}
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.hover(screen.getByRole("spinbutton"));

    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });
  })
});