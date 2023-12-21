jest.mock("@/reactQuery/usePrices");
jest.mock("@/reactQuery/useSubscriptions");
jest.mock("@/reactQuery/useSession");

import { renderHook } from "@testing-library/react"

import hook from "./useCheckoutLogic";
import QueryClientProvider from "@/providers/QueryClientProvider";
import { useGetPriceById, useGetPrices } from "@/reactQuery/usePrices";
import { useGetSession } from "@/reactQuery/useSession";
import { useGetSubscriptions } from "@/reactQuery/useSubscriptions";
import createUseQueryMock from "__utils__/createUseQueryMock";

const mockedUseGetPriceById = useGetPriceById as jest.Mock;
const mockedUseGetPrices = useGetPrices as jest.Mock;
const mockedUseGetSubscriptions = useGetSubscriptions as jest.Mock;
const mockedUseGetSession = useGetSession as jest.Mock;


const wrapper = QueryClientProvider;

describe("useCheckoutLogic", () => {
  const priceId = "price_id";
  const lookupKey = "lookup_key";

  afterEach(() => jest.clearAllMocks());

  it("should select the correct price by id", () => {
    mockedUseGetPriceById.mockReturnValueOnce(createUseQueryMock("success", { data: { id: priceId } })());
    mockedUseGetPrices.mockReturnValueOnce(createUseQueryMock("success", { data: { lookupKey } })());
    const { result } = renderHook(() => hook({ priceId }), { wrapper });

    expect(mockedUseGetPriceById).toHaveBeenCalledWith(priceId, expect.any(Object));
    expect(mockedUseGetPrices).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
    expect(result.current).toHaveProperty("price", expect.objectContaining({ id: priceId }));
  })

  it("should select the correct price by lookup key", () => {
    mockedUseGetPriceById.mockReturnValueOnce(createUseQueryMock("success", { data: { id: priceId } })());
    mockedUseGetPrices.mockReturnValueOnce(createUseQueryMock("success", { data: { lookupKey } })());
    const { result } = renderHook(() => hook({ lookupKey }), { wrapper });

    expect(mockedUseGetPriceById).toHaveBeenCalledWith(undefined, expect.any(Object));
    expect(mockedUseGetPrices).toHaveBeenCalledWith(expect.objectContaining({
      enabled: true,
      params: expect.objectContaining({ lookup_keys: [lookupKey] }),
    }));
    expect(result.current).toHaveProperty("price", expect.objectContaining({ lookupKey }));
  })

  it("should have state subscribe when with no customerId and price", () => {
    const { result } = renderHook(() => hook({ priceId }), { wrapper });

    expect(result.current).toHaveProperty("state", "subscribe");
  })

  it("should have state loading when price is loading", () => {
    mockedUseGetPriceById.mockReturnValueOnce(createUseQueryMock("loading")());
    const { result } = renderHook(() => hook({ priceId }), { wrapper });

    expect(result.current).toHaveProperty("state", "loading");
  })

  it("should have state loading with customerId and subscriptions loading", () => {
    mockedUseGetSession.mockReturnValueOnce(createUseQueryMock("success", { data: "customer_id" })());
    mockedUseGetSubscriptions.mockReturnValueOnce(createUseQueryMock("loading")());
    const { result } = renderHook(() => hook({ priceId }), { wrapper });

    expect(result.current).toHaveProperty("state", "loading");
  })

  it("should have state error when price is error", () => {
    mockedUseGetPriceById.mockReturnValueOnce(createUseQueryMock("error")());
    const { result } = renderHook(() => hook({ priceId }), { wrapper });

    expect(result.current).toHaveProperty("state", "error");
  })

  it("should have state change when customer has a subscription", () => {
    mockedUseGetSession.mockReturnValueOnce(createUseQueryMock("success", { data: "customer_id" })());
    mockedUseGetSubscriptions.mockReturnValueOnce(createUseQueryMock("success", { data: [{ id: "subcription" }] })());
    const { result } = renderHook(() => hook({ priceId }), { wrapper });

    expect(result.current).toHaveProperty("state", "change");
  })
})