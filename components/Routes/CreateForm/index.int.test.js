import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";

import CreateRouteForm from ".";
import QueryClientProvider from "@/shared/providers/QueryClientProvider";
import ThemeProvider from "@/shared/providers/ThemeProvider";
import httpClient from "@/shared/utils/httpClient";
import localStorageClient from "@/shared/utils/localStorageClient";

jest.unmock("react-query");
jest.mock("@/shared/utils/httpClient", () => ({
  request: jest.fn(),
}));
jest.mock("@/shared/utils/localStorageClient", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));
const windowMock = jest.spyOn(window, "navigator", "get");

const STOP_0 = "Stop 0 Address";
const STOP_1 = "Stop 1 Address";
const STOP_2 = "Stop 2 Address";
const STOP_3 = "Stop 3 Address";
const STOP_TIME = "5";


function wrapper({ children }) {
  return (
    <QueryClientProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const getStopInputs = () => screen.getAllByPlaceholderText(/enter an address/i);
const getAddStopButton = () => screen.getByRole("button", { name: /add stop/i });
const getOriginInput = () => screen.getByLabelText(/^origin$/i);
const getDestinationInput = () => screen.getByLabelText(/^destination$/i);
const getStopTimeInput = () => screen.getByLabelText(/stop time/i);
const getSubmitButton = () => screen.getByRole("button", { name: /calculate route/i });

describe("CreateRouteForm", () => {
  beforeEach(() => {
    windowMock.mockImplementation(() => ({
      permissions: {
        query: jest.fn().mockResolvedValue({
          state: "state",
          addEventListener: jest.fn(),
        }),
      },
    }));
  });

  afterEach(jest.clearAllMocks);

  it("properly handles entering form data", async () => {
    httpClient.request.mockResolvedValue({
      data: {},
    });

    render(
      <CreateRouteForm />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getStopInputs()).toHaveLength(3);
    });

    const stops = getStopInputs();

    await userEvent.type(stops[0], STOP_0);
    await userEvent.type(stops[1], STOP_1);
    await userEvent.type(stops[2], STOP_2);

    await userEvent.click(getAddStopButton());

    await waitFor(() => {
      expect(getStopInputs()[3]).toBeInTheDocument();
    });
    const stop3 = getStopInputs()[3];
    await userEvent.type(stop3, STOP_3);

    await userEvent.selectOptions(getOriginInput(), STOP_0);
    await userEvent.selectOptions(getDestinationInput(), STOP_3);

    await userEvent.type(getStopTimeInput(), STOP_TIME);

    httpClient.request.mockClear();
    httpClient.request.mockResolvedValue({
      data: {
        routes: [{}],
      },
    });

    await userEvent.click(getSubmitButton());

    expect(httpClient.request).toBeCalledWith({
      url: "api/directions",
      method: expect.stringMatching(/get/i),
      params: {
        stops: `type:origin;${encodeURIComponent(STOP_0)}|${encodeURIComponent(STOP_1)}|${encodeURIComponent(STOP_2)}|type:destination;${encodeURIComponent(STOP_3)}`,
      },
    });

    expect(localStorageClient.setItem).toBeCalledWith("routes", expect.any(String));

    expect(useRouter().push).toBeCalledWith({
      pathname: "/routes/[_id]",
      query: {
        _id: expect.any(String),
      },
    });
  }, 40000);
});