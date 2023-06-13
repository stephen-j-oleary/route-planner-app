import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DeleteAccount from ".";
import { useDeleteUserById } from "@/shared/reactQuery/useUsers";

jest.mock("@/shared/reactQuery/useUsers");
jest.mock("@/shared/reactQuery/useAccounts");

const MINIMAL_PROPS = {
  user: { _id: "id" },
};


describe("DeleteAccount", () => {
  afterEach(jest.clearAllMocks);

  it("is a button", () => {
    render(
      <DeleteAccount
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("is disabled when mutation is loading", () => {
    useDeleteUserById.mockReturnValueOnce({ isLoading: true });
    render(
      <DeleteAccount
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("shows a confirmation dialog", async () => {
    render(
      <DeleteAccount
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("calls delete when confirmed", async () => {
    render(
      <DeleteAccount
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /delete/i }));
    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    expect(useDeleteUserById().mutate).toBeCalledTimes(1);
  });

  it("does not call delete when cancelled", async () => {
    render(
      <DeleteAccount
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /delete/i }));
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(useDeleteUserById().mutate).not.toBeCalled();
  });

  it("closes the confirmation dialog when cancelled or confirmed", async () => {
    render(
      <DeleteAccount
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /delete/i }));
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /delete/i }));
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});