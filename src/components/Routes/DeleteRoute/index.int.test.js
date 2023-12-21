import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DeleteRoute from ".";
import QueryClientProvider from "@/providers/QueryClientProvider";
import httpClient from "@/utils/httpClient";

jest.unmock("react-query");
jest.mock("@/utils/httpClient", () => ({
  request: jest.fn(),
}));

const ROUTE = {
  _id: "route_id",
};


const wrapper = props => <QueryClientProvider {...props} />;

const getButton = () => screen.getByRole("button", { name: /delete route/i });

describe("DeleteRoute", () => {
  beforeEach(() => {
    httpClient.request.mockResolvedValue({
      data: {},
    });
  });
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

    expect(httpClient.request).toBeCalledWith({
      url: `api/routes/${ROUTE._id}`,
      method: expect.stringMatching(/delete/i),
    });
  });
});