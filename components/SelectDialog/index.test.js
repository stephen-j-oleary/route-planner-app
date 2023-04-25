import { getByLabelText, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SelectDialog from ".";
import ConfirmationDialog from "@/components/ConfirmationDialog";

jest.mock("@/components/ConfirmationDialog");

const MINIMAL_PROPS = {
  renderTriggerButton: props => (
    <button {...props}>Trigger</button>
  ),
  options: [1, 2, 3],
};


describe("SelectDialog", () => {
  it("is a confirmation dialog", () => {
    render(
      <SelectDialog
        {...MINIMAL_PROPS}
      />
    );

    expect(ConfirmationDialog).toBeCalled();
  });

  it("adds a radio group", async () => {
    render(
      <SelectDialog
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /trigger/i }));

    await waitFor(() => {
      expect(screen.getAllByRole("radiogroup").length).toBeGreaterThan(0);
    });
  });

  it("adds the radio group value as the first argument to the render button props", async () => {
    const VALUE = "value";
    const confirmRender = jest.fn();
    const cancelRender = jest.fn();
    render(
      <SelectDialog
        {...MINIMAL_PROPS}
        value={VALUE}
        renderConfirmButton={confirmRender}
        renderCancelButton={cancelRender}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /trigger/i }));

    expect(confirmRender).toBeCalledWith(VALUE, expect.objectContaining({ popupState: expect.any(Object) }));
    expect(cancelRender).toBeCalledWith(VALUE, expect.objectContaining({ popupState: expect.any(Object) }));
  });

  it("handles controlled radio group", async () => {
    const value = "value";
    const onChange = jest.fn();
    render(
      <SelectDialog
        {...MINIMAL_PROPS}
        value={value}
        onChange={onChange}
        options={["1", "2", "3"]}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /trigger/i }));
    const radioGroup = await screen.findByRole("radiogroup");
    await userEvent.click(getByLabelText(radioGroup, "1"));

    expect(onChange).toBeCalledWith("1");

    await userEvent.click(getByLabelText(radioGroup, "2"));

    expect(onChange).toBeCalledWith("2");
  });

  it("handles uncontrolled radio group", async () => {
    render(
      <SelectDialog
        {...MINIMAL_PROPS}
        options={["1", "2", "3"]}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /trigger/i }));
    const radioGroup = await screen.findByRole("radiogroup");
    await userEvent.click(getByLabelText(radioGroup, "1"));

    expect(getByLabelText(radioGroup, "1")).toBeChecked();

    await userEvent.click(getByLabelText(radioGroup, "2"));

    expect(getByLabelText(radioGroup, "2")).toBeChecked();
  });
});