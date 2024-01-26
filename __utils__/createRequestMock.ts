import { createMocks, RequestOptions, ResponseOptions } from "node-mocks-http";


export default function createRequestMock(reqOptions?: RequestOptions, resOptions?: ResponseOptions) {
  const { req, res } = createMocks(reqOptions, resOptions);
  const next = jest.fn();

  return { req, res, next };
}