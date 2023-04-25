import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ConfirmationDialog from ".";

const MINIMAL_PROPS = {
  renderTriggerButton: props => (
    <button {...props}>Trigger</button>
  ),
};

describe("ConfirmationDialog", () => {
  it("has a trigger button", () => {
    render(
      <ConfirmationDialog
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("button", { name: /trigger/i })).toBeInTheDocument();
  });

  it("trigger button shows dialog", async () => {
    render(
      <ConfirmationDialog
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /trigger/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("has the expected title", async () => {
    const TITLE = "title";
    render(
      <ConfirmationDialog
        {...MINIMAL_PROPS}
        title={TITLE}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /trigger/i }));

    expect(screen.getByRole("dialog", { name: TITLE })).toBeInTheDocument();
  });

  it("has the expected message and children", async () => {
    const MESSAGE = "message";
    const CHILD_ID = "child-id";
    render(
      <ConfirmationDialog
        {...MINIMAL_PROPS}
        message={MESSAGE}
      >
        <div data-testid={CHILD_ID} />
      </ConfirmationDialog>
    );

    await userEvent.click(screen.getByRole("button", { name: /trigger/i }));

    expect(screen.getByText(MESSAGE)).toBeInTheDocument();
    expect(screen.getByTestId(CHILD_ID)).toBeInTheDocument();
  });

  it("handles button label props", async () => {
    const CONFIRM_LABEL = "confirm";
    const CANCEL_LABEL = "cancel";
    render(
      <ConfirmationDialog
        {...MINIMAL_PROPS}
        confirmButtonLabel={CONFIRM_LABEL}
        cancelButtonLabel={CANCEL_LABEL}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /trigger/i }));

    expect(screen.getByRole("button", { name: CONFIRM_LABEL })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: CANCEL_LABEL })).toBeInTheDocument();
  });

  it("handles button render props", async () => {
    const confirmRender = jest.fn();
    const cancelRender = jest.fn();
    render(
      <ConfirmationDialog
        {...MINIMAL_PROPS}
        renderConfirmButton={confirmRender}
        renderCancelButton={cancelRender}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /trigger/i }));

    expect(confirmRender).toBeCalledWith(expect.objectContaining({ popupState: expect.any(Object) }));
    expect(cancelRender).toBeCalledWith(expect.objectContaining({ popupState: expect.any(Object) }));
  });

  it("buttons close dialog", async () => {
    render(
      <ConfirmationDialog
        {...MINIMAL_PROPS}
        confirmButtonLabel="Confirm"
        cancelButtonLabel="Cancel"
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /trigger/i }));
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /trigger/i }));
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});