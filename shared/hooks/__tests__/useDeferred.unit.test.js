import { act, renderHook } from "@testing-library/react";

import useDeferred from "../useDeferred";


describe("useDeferred", () => {
  it("has the expected properties and methods", () => {
    const { result } = renderHook(() => useDeferred());

    expect(result.current).toStrictEqual(
      expect.objectContaining({
        promise: expect.any(Promise),
        execute: expect.any(Function),
        resolve: expect.any(Function),
        reject: expect.any(Function),
      })
    );
  });

  it("resolve resolves the promise", async () => {
    const RESOLVE_VALUE = "resolved";
    const { result } = renderHook(() => useDeferred());

    act(() => {
      result.current.resolve(RESOLVE_VALUE);
    });

    await expect(result.current.promise).resolves.toBe(RESOLVE_VALUE);
  });

  it("reject rejects the promise", async () => {
    const REJECT_VALUE = "rejected";

    const { result } = renderHook(() => useDeferred());

    act(() => {
      result.current.reject(REJECT_VALUE);
    });

    await expect(result.current.promise).rejects.toBe(REJECT_VALUE);
  });

  it("passing conditions resolves the promise when all are true", async () => {
    const RESOLVE_VALUE = "resolved";
    const { result, rerender } = renderHook(({ condition = false } = {}) => useDeferred(condition, RESOLVE_VALUE));

    // Change the condition to true
    act(() => {
      rerender({ condition: true });
    });

    await expect(result.current.promise).resolves.toBe(RESOLVE_VALUE);
  });

  it("execute returns the promise", async () => {
    const { result } = renderHook(() => useDeferred());

    act(() => {
      result.current.resolve();
    });

    expect(result.current.execute()).toBe(result.current.promise);
  });
});