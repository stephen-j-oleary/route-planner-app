jest.mock("@/shared/reactQuery/useSubscriptions");

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import RenewSubscription from ".";
import createUseMutationMock from "@/__utils__/createUseMutationMock";
import { useUpdateSubscriptionById } from "@/shared/reactQuery/useSubscriptions";

const mockedUseUpdateSubscriptionById = useUpdateSubscriptionById as jest.Mock;

const MINIMAL_PROPS = {
  subscription: {
    id: "subscription-id",
  },
};


describe("RenewSubscription", () => {
  afterEach(() => jest.clearAllMocks());

  it("is a menuitem", () => {
    render(
      <RenewSubscription
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("menuitem", { name: /renew/i })).toBeInTheDocument();
  });

  it("is disabled when mutation is loading", () => {
    mockedUseUpdateSubscriptionById.mockReturnValueOnce(createUseMutationMock("loading")());
    render(
      <RenewSubscription
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("menuitem", { name: /renew/i })).toHaveAttribute("aria-disabled");
  });

  it("shows a confirmation dialog", async () => {
    render(
      <RenewSubscription
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.click(screen.getByRole("menuitem", { name: /renew/i }));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("calls delete when confirmed", async () => {
    render(
      <RenewSubscription
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.click(screen.getByRole("menuitem", { name: /renew/i }));
    await userEvent.click(screen.getByRole("button", { name: /renew/i }));

    expect(useUpdateSubscriptionById().mutate).toBeCalledTimes(1);
  });

  it("does not call delete when canceled", async () => {
    render(
      <RenewSubscription
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.click(screen.getByRole("menuitem", { name: /renew/i }));
    await userEvent.click(screen.getByRole("button", { name: /back/i }));

    expect(useUpdateSubscriptionById().mutate).not.toBeCalled();
  });

  it("closes the confirmation dialog when canceled or confirmed", async () => {
    render(
      <RenewSubscription
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.click(screen.getByRole("menuitem", { name: /renew/i }));
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: /back/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("menuitem", { name: /renew/i }));
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: /renew/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});