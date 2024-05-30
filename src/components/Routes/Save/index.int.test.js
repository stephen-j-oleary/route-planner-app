import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SaveRoute from ".";
import pages from "@/pages";
import QueryClientProvider from "@/providers/QueryClientProvider";

const ROUTE = {
  name: "Route",
};


const wrapper = props => <QueryClientProvider {...props} />;

const getButton = () => screen.getByRole("button", { name: /save route/i });

describe("SaveRoute", () => {
  afterEach(jest.clearAllMocks);

  it("properly handles saving the route", async () => {
    render(
      <SaveRoute route={ROUTE} />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getButton()).toBeInTheDocument();
    });
    await userEvent.click(getButton());

    expect(fetch).toBeCalledWith({
      url: pages.api.routes,
      method: expect.stringMatching(/post/i),
      data: ROUTE,
    });
  });
});