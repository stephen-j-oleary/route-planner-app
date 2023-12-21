import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DeleteRoute from ".";
import { useDeleteDatabaseRoute } from "@/reactQuery/useDatabaseRoutes";

jest.mock("@/reactQuery/useDatabaseRoutes");

const MINIMAL_PROPS = {
  route: { _id: "id" },
};


describe("DeleteRoute", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("is a button", () => {
    render(
      <DeleteRoute
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("is disabled when mutation is loading", () => {
    useDeleteDatabaseRoute.mockReturnValueOnce({ isLoading: true });
    render(
      <DeleteRoute
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("calls delete when clicked", async () => {
    render(
      <DeleteRoute
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    expect(useDeleteDatabaseRoute().mutate).toBeCalledTimes(1);
  });
});