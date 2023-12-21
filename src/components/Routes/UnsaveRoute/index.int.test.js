import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import UnsaveRoute from ".";
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

const getButton = () => screen.getByRole("button", { name: /unsave route/i });

describe("UnsaveRoute", () => {
  beforeEach(() => {
    httpClient.request.mockResolvedValue({
      data: {},
    });
  });
  afterEach(jest.clearAllMocks);

  it("properly handles unsaving a saved route", async () => {
    render(
      <UnsaveRoute route={ROUTE} />,
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