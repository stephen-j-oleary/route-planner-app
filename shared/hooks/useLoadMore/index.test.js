import { act, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import useLoadMore from ".";


describe("useLoadMore", () => {
  it("has the default initial value", () => {
    const { result } = renderHook(() => useLoadMore([]));

    expect(result.current.current).toBe(0);
  });

  it("has the passed initial value", () => {
    const INITIAL = 2;
    const { result } = renderHook(() => useLoadMore([], INITIAL));

    expect(result.current.current).toBe(INITIAL);
  });

  it("trims the items to the current length", () => {
    const INITIAL = 2;
    const { result } = renderHook(() => useLoadMore([1, 2, 3], INITIAL));

    expect(result.current.visible).toHaveLength(INITIAL);
  });

  it("hasMore is true when items length is greater than current length", () => {
    const { result } = renderHook(() => useLoadMore([1, 2, 3], 2));

    expect(result.current.hasMore).toBe(true);
  });

  it("increment increases the current length", async () => {
    const INITIAL = 2;
    const { result } = renderHook(() => useLoadMore([], INITIAL));

    act(() => {
      result.current.increment();
    });

    expect(result.current.current).toBeGreaterThan(INITIAL);
  });

  it("decrement decreases the current length", () => {
    const INITIAL = 2;
    const { result } = renderHook(() => useLoadMore([], INITIAL));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.current).toBeLessThan(INITIAL);
  });

  it("decrement stops at zero", () => {
    const { result } = renderHook(() => useLoadMore([], 1));

    act(() => {
      result.current.decrement();
      result.current.decrement();
    });

    expect(result.current.current).toBe(0);
  });

  it("reset sets current length to initial length", () => {
    const INITIAL = 2;
    const { result } = renderHook(() => useLoadMore([], INITIAL));

    act(() => {
      result.current.increment();
      result.current.reset();
    });

    expect(result.current.current).toBe(INITIAL);
  });

  it("has the default increment value", () => {
    const INITIAL = 2;
    const { result } = renderHook(() => useLoadMore([], INITIAL));

    act(() => {
      result.current.increment();
    });

    expect(result.current.current).toBe(INITIAL + 3);
  });

  it("has an IncrementButton with load more text when more items available", () => {
    const { result } = renderHook(() => useLoadMore([1, 2, 3]));
    render(<result.current.IncrementButton />);

    expect(screen.getByRole("button", { name: /more/i })).toBeInTheDocument();
  });

  it("has an IncrementButton with end of list text when no more items are available", () => {
    const { result } = renderHook(() => useLoadMore([]));
    render(<result.current.IncrementButton />);

    expect(screen.getByRole("button", { name: /end of list/i })).toBeInTheDocument();
  });

  it("IncrementButton has an increment callback when more items available", async () => {
    const { result } = renderHook(() => useLoadMore([1, 2, 3]));
    render(<result.current.IncrementButton />);

    const prevValue = result.current.current;
    await userEvent.click(screen.getByRole("button"));

    expect(result.current.current).toBeGreaterThan(prevValue);
  });

  it("IncrementButton has no callback when no more items available", async () => {
    const { result } = renderHook(() => useLoadMore([]));
    render(<result.current.IncrementButton />);

    expect(screen.getByRole("button")).toHaveStyle({ "pointer-events": "none" });
  });

  it("has a DecrementButton", () => {
    const { result } = renderHook(() => useLoadMore([]));
    render(<result.current.DecrementButton />);

    expect(screen.getByRole("button", { name: /less/i })).toBeInTheDocument();
  });

  it("DecrementButton has a decrement callback", async () => {
    const { result } = renderHook(() => useLoadMore([1, 2, 3], 2));
    render(<result.current.DecrementButton />);

    const prevValue = result.current.current;
    await userEvent.click(screen.getByRole("button"));

    expect(result.current.current).toBeLessThanOrEqual(prevValue);
  });

  it("has a ResetButton", () => {
    const { result } = renderHook(() => useLoadMore([]));
    render(<result.current.ResetButton />);

    expect(screen.getByRole("button", { name: /less/i })).toBeInTheDocument();
  });

  it("ResetButton has a reset callback", async () => {
    const INITIAL = 2;
    const { result } = renderHook(() => useLoadMore([1, 2, 3], INITIAL));
    render(<result.current.DecrementButton />);

    act(() => {
      result.current.increment();
    });
    await userEvent.click(screen.getByRole("button"));

    expect(result.current.current).toBe(INITIAL);
  });
});