import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DeleteRoute from ".";
import pages from "@/pages";
import QueryClientProvider from "@/providers/QueryClientProvider";

const ROUTE = {
  _id: "route_id",
};


const wrapper = props => <QueryClientProvider {...props} />;

const getButton = () => screen.getByRole("button", { name: /delete route/i });

describe("DeleteRoute", () => {
  afterEach(jest.clearAllMocks);

  it("properly handles removing the saved route", async () => {
    render(
      <DeleteRoute route={ROUTE} />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getButton()).toBeInTheDocument();
    });
    await userEvent.click(getButton());

    expect(fetch).toBeCalledWith({
      url: `${pages.api.routes}/${ROUTE._id}`,
      method: expect.stringMatching(/delete/i),
    });
  });
});