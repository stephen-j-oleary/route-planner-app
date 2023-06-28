import { createMocks } from "node-mocks-http";

/**
 * @param {import("node-mocks-http").RequestOptions} reqOptions
 * @param {import("node-mocks-http").ResponseOptions} resOptions
 */
export default function createRequestMock(reqOptions, resOptions) {
  const { req, res } = createMocks(reqOptions, resOptions);
  const next = jest.fn();

  return { req, res, next };
}