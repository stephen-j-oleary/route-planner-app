import { getByRole, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SubscriptionFormConfirmationPreview from ".";

const SUBSCRIPTION_CHANGE_PREVIEW_ID = "subscription-change-preview-id";
jest.mock("@/components/Subscriptions/ChangePreview", () => (
  function SubscriptionChangePreviewMock() {
    return <div data-testid={SUBSCRIPTION_CHANGE_PREVIEW_ID} />;
  }
));

const MINIMAL_PROPS = {
  renderTriggerButton: jest.fn(props => <button {...props}>Trigger button</button>),
  previewProps: {},
};

const submitMock = jest.fn(e => e.preventDefault());
function setupContainer() {
  const form = document.createElement("form");
  form.addEventListener("submit", submitMock);
  return document.body.appendChild(form);
}


describe("SubscriptionFormConfirmationPreview", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("shows the trigger button", () => {
    render(
      <SubscriptionFormConfirmationPreview
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("button", { name: /trigger/i })).toBeInTheDocument();
  });

  it("shows a confirmation dialog", async () => {
    render(
      <SubscriptionFormConfirmationPreview
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /trigger/i }));

    await waitFor(() => {
      expect(screen.getByRole("dialog", { name: /subscribe/i, hidden: true })).toBeInTheDocument();
    });
  });

  it("calls form submit when subscription change is confirmed", async () => {
    const container = setupContainer();
    render(
      <SubscriptionFormConfirmationPreview
        {...MINIMAL_PROPS}
      />,
      { container }
    );

    await userEvent.click(screen.getByRole("button", { name: /trigger/i }));
    const dialog = await screen.findByRole("dialog", { hidden: true });
    await userEvent.click(getByRole(dialog, "button", { name: /subscribe/i, hidden: true }));

    await waitFor(() => {
      expect(submitMock).toBeCalledTimes(1);
    });
  });

  it("does not call form submit when subscription change is cancelled", async () => {
    const container = setupContainer();
    render(
      <SubscriptionFormConfirmationPreview
        {...MINIMAL_PROPS}
      />,
      { container }
    );

    await userEvent.click(screen.getByRole("button", { name: /trigger/i }));
    const dialog = await screen.findByRole("dialog", { hidden: true });
    await userEvent.click(getByRole(dialog, "button", { name: /cancel/i, hidden: true }));

    await waitFor(() => {
      expect(submitMock).not.toBeCalled();
    });
  });
});