import { getAllByRole, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";

import SelectStopInput from ".";

const MINIMAL_PROPS = {
  name: "stopSelect",
  stops: [
    { value: "stop1" },
    { value: "stop2" },
    { value: "stop3" },
  ],
};


function setupForm() {
  const { result } = renderHook(() => useForm({ defaultValues: { stopSelect: "0" } }));
  return result.current;
}

describe("CreateRouteFormSelectStopInput", () => {
  it("is a select input", () => {
    const form = setupForm();
    render(
      <SelectStopInput
        form={form}
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("sets the form value to the selected option", async () => {
    const form = setupForm();
    render(
      <SelectStopInput
        form={form}
        {...MINIMAL_PROPS}
      />
    );
    const combobox = screen.getByRole("combobox");

    await userEvent.click(combobox);
    await userEvent.selectOptions(combobox, getAllByRole(combobox, "option")[1]);

    expect(form.getValues(MINIMAL_PROPS.name)).toBe("1");
  });
});