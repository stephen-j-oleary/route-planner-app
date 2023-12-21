import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import UnsaveRoute from ".";
import { useDeleteDatabaseRoute } from "@/reactQuery/useDatabaseRoutes";

jest.mock("@/shared/reactQuery/useDatabaseRoutes");

const MINIMAL_PROPS = {
  route: { _id: "id" },
};


describe("UnsaveRoute", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("is a button", () => {
    render(
      <UnsaveRoute
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("is disabled when mutation is loading", () => {
    useDeleteDatabaseRoute.mockReturnValueOnce({ isLoading: true });
    render(
      <UnsaveRoute
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("calls delete when clicked", async () => {
    render(
      <UnsaveRoute
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /unsave/i }));

    expect(useDeleteDatabaseRoute().mutate).toBeCalledTimes(1);
  });
});