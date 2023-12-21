import { renderHook } from "@testing-library/react";

import useUserAvatar from ".";
import { useGetSession } from "@/reactQuery/useSession";

jest.mock("@/reactQuery/useSession");


describe("useUserAvatar", () => {
  it("has a getProps method", () => {
    const { result } = renderHook(() => useUserAvatar());

    expect(result.current).toHaveProperty("getProps");
  });

  it("getProps returns an object with the expected src property", () => {
    const VALUE = "src-value";
    useGetSession.mockReturnValueOnce({
      isFetched: true,
      data: { image: VALUE },
    });
    const { result } = renderHook(() => useUserAvatar());
    const props = result.current.getProps();

    expect(props.src).toBe(VALUE);
  });

  it("getProps returns an object with the expected children property", () => {
    const VALUE = "email-value";
    const EXPECTED_VALUE = "e";
    useGetSession.mockReturnValueOnce({
      isFetched: true,
      data: { email: VALUE },
    });
    const { result } = renderHook(() => useUserAvatar());
    const props = result.current.getProps();

    expect(props.children).toBe(EXPECTED_VALUE);
  });

  it("getProps returns an object with the expected sx property", () => {
    const size = 20;
    const { result } = renderHook(() => useUserAvatar({ size }));
    const props = result.current.getProps();

    expect(props.sx).toEqual({
      width: size,
      height: size,
    });
  });
});