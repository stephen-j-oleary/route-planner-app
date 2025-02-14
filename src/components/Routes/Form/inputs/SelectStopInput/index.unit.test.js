import { getAllByRole, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SelectStopInput from ".";

const MINIMAL_PROPS = {
  name: "stopSelect",
  stops: [
    { value: "stop1" },
    { value: "stop2" },
    { value: "stop3" },
  ],
};


describe("CreateRouteFormSelectStopInput", () => {
  it("is a select input", () => {
    render(
      <SelectStopInput
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("sets the form value to the selected option", async () => {
    render(
      <SelectStopInput
        {...MINIMAL_PROPS}
      />
    );
    const combobox = screen.getByRole("combobox");

    await userEvent.click(combobox);
    await userEvent.selectOptions(combobox, getAllByRole(combobox, "option")[1]);

    //expect(form.getValues(MINIMAL_PROPS.name)).toBe("1");
  });
});