import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SaveRoute from ".";
import { useCreateDatabaseRoute } from "@/shared/reactQuery/useDatabaseRoutes";

jest.mock("@/shared/reactQuery/useDatabaseRoutes");

const MINIMAL_PROPS = {
  route: { _id: "id" },
};


describe("SaveRoute", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("is a button", () => {
    render(
      <SaveRoute
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("is disabled when mutation is loading", () => {
    useCreateDatabaseRoute.mockReturnValueOnce({ isLoading: true });
    render(
      <SaveRoute
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("calls create when clicked", async () => {
    render(
      <SaveRoute
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(useCreateDatabaseRoute().mutate).toBeCalledTimes(1);
  });
});