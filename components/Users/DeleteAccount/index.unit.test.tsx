jest.mock("@/shared/reactQuery/useAccounts");

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DeleteAccount from ".";
import createUseMutationMock from "@/__utils__/createUseMutationMock";
import { useDeleteAccountByUser } from "@/shared/reactQuery/useAccounts";

const mockedUseDeleteAccountByUser = useDeleteAccountByUser as jest.Mock;


const MINIMAL_PROPS = {
  userId: "id",
};


describe("DeleteAccount", () => {
  afterEach(() => jest.clearAllMocks());

  it("is a button", () => {
    render(
      <DeleteAccount
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("is disabled when mutation is loading", () => {
    mockedUseDeleteAccountByUser.mockReturnValueOnce(createUseMutationMock("loading")());
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

    expect(mockedUseDeleteAccountByUser().mutate).toHaveBeenCalledTimes(1);
  });

  it("does not call delete when canceled", async () => {
    render(
      <DeleteAccount
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /delete/i }));
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(mockedUseDeleteAccountByUser().mutate).not.toHaveBeenCalled();
  });

  it("closes the confirmation dialog when canceled or confirmed", async () => {
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