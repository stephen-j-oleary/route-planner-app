import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SaveRoute from ".";


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

    expect(true).toBe(false);
  });
});