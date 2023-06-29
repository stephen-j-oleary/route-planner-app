import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SaveRoute from ".";
import QueryClientProvider from "@/shared/providers/QueryClientProvider";
import httpClient from "@/shared/utils/httpClient";

jest.unmock("react-query");
jest.mock("@/shared/utils/httpClient", () => ({
  request: jest.fn(),
}));

const ROUTE = {
  name: "Route",
};


const wrapper = props => <QueryClientProvider {...props} />;

const getButton = () => screen.getByRole("button", { name: /save route/i });

describe("SaveRoute", () => {
  beforeEach(() => {
    httpClient.request.mockResolvedValue({
      data: {},
    });
  });
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

    expect(httpClient.request).toBeCalledWith({
      url: "api/routes",
      method: expect.stringMatching(/post/i),
      data: ROUTE,
    });
  });
});