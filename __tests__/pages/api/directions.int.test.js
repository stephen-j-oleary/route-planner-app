/**
 * @jest-environment node
 */

import { getServerSession } from "next-auth/next";

import createRequestMock from "@/__utils__/createRequestMock";
import { getDirectionsHandler } from "@/pages/api/directions";
import httpClient from "@/shared/utils/httpClient";
import stripeClient from "@/shared/utils/stripeClient";

jest.mock("@/shared/utils/httpClient", () => ({
  request: jest.fn(),
}));
jest.mock("@/shared/utils/stripeClient");

const MOCK_HTTP_RESPONSE = {
  data: {
    key1: "value1",
    key2: "value2",
  },
};

const STOPS_STRING = "origin:1676 40th Street, Calgary, AB|3368 Heritage Drive, Calgary, AB|235 Heritage Drive, Calgary, AB|1956 Fourth Avenue, Calgary, AB|destination:785 7th Ave, Calgary, AB";


describe("/directions", () => {
  beforeEach(() => {
    httpClient.request.mockResolvedValue(MOCK_HTTP_RESPONSE);
  });
  afterEach(jest.clearAllMocks);

  it("properly handles a valid request", async () => {
    const { req, res } = createRequestMock({
      path: "/directions",
      method: "GET",
      query: {
        stops: STOPS_STRING,
      },
    });

    await getDirectionsHandler(req, res);

    expect(httpClient.request).toBeCalledWith({
      method: expect.stringMatching(/get/i),
      url: expect.any(String),
      headers: {
        "X-RapidAPI-Key": expect.any(String),
        "X-RapidAPI-Host": expect.any(String),
      },
      params: {
        stops: STOPS_STRING,
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(MOCK_HTTP_RESPONSE.data);
  });

  it("properly handles a signed out request", async () => {
    getServerSession.mockResolvedValueOnce({});

    const { req, res } = createRequestMock({
      path: "/directions",
      method: "GET",
      query: {
        stops: STOPS_STRING,
      },
    });

    await expect(getDirectionsHandler(req, res)).rejects.toEqual({ status: 401, message: "Sign in required" });
  });

  it("properly handles a request without a customer", async () => {
    getServerSession.mockResolvedValueOnce({ user: {} });

    const { req, res } = createRequestMock({
      path: "/directions",
      method: "GET",
      query: {
        stops: STOPS_STRING,
      },
    });

    await expect(getDirectionsHandler(req, res)).rejects.toEqual({ status: 401, message: "Subscription required" });
  });

  it("properly handles a request without a subscription", async () => {
    stripeClient.subscriptions.list.mockResolvedValueOnce({});

    const { req, res } = createRequestMock({
      path: "/directions",
      method: "GET",
      query: {
        stops: STOPS_STRING,
      },
    });

    await expect(getDirectionsHandler(req, res)).rejects.toEqual({ status: 401, message: "Subscription required" });
  });

  it("properly handles a request without a subscriptionItem", async () => {
    stripeClient.subscriptions.list.mockResolvedValueOnce({
      data: [{
        items: {},
      }],
    });

    const { req, res } = createRequestMock({
      path: "/directions",
      method: "GET",
      query: {
        stops: STOPS_STRING,
      },
    });

    await expect(getDirectionsHandler(req, res)).rejects.toEqual({ status: 401, message: "Subscription required" });
  });
});