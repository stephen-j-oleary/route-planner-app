import createUseDeferredMock from "@/__utils__/createUseDeferredMock";

export default jest.fn().mockImplementation(
  createUseDeferredMock({ status: "resolved" })
);