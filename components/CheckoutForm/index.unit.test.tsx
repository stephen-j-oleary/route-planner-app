jest.mock("@/shared/reactQuery/useSession");
jest.mock("@/shared/reactQuery/useSubscriptions");
jest.mock("@/shared/reactQuery/usePrices");
jest.mock("@/shared/reactQuery/useCheckoutSession");
jest.mock("@/shared/reactQuery/useInvoices");

import { render, screen, waitFor } from "@testing-library/react";

import Component from ".";
import createUseQueryMock from "@/__utils__/createUseQueryMock";
import QueryClientProvider from "@/shared/providers/QueryClientProvider";
import { useGetPriceById } from "@/shared/reactQuery/usePrices";
import { useGetSubscriptions } from "@/shared/reactQuery/useSubscriptions";

const mockedUseGetSubscriptions = useGetSubscriptions as jest.Mock;
const mockedUseGetPriceById = useGetPriceById as jest.Mock;


const MINIMAL_PROPS = {
  priceId: "price_id",
};

const wrapper = QueryClientProvider;

describe("CheckoutForm", () => {
  const PROD_1 = { id: "prod_1", name: "Name" };
  const PRICE_1 = { id: "price_1", product: PROD_1, unit_amount: 10, currency: "cad", recurring: { interval_count: 1, interval: "month" } };
  const PRICE_2 = { id: "price_2", product: PROD_1, unit_amount: 20, currency: "cad", recurring: { interval_count: 2, interval: "month" } };
  const SUB_1 = { id: "sub_1", items: { data: [{ price: PRICE_1 }] } };

  beforeEach(() => jest.clearAllMocks());

  it("shows loading indicator when loading subscriptions", () => {
    mockedUseGetSubscriptions.mockReturnValue(createUseQueryMock("loading")());
    render(<Component {...MINIMAL_PROPS} />, { wrapper });

    expect(screen.getByRole("form", { busy: true })).toBeVisible();
  })

  it("shows error notice", () => {
    mockedUseGetSubscriptions.mockReturnValue(createUseQueryMock("error")());
    render(<Component {...MINIMAL_PROPS} />, { wrapper });

    expect(screen.getByText(/failed to load/i)).toBeVisible();
  })

  it("shows subscription change when subbed to another plan", async () => {
    mockedUseGetSubscriptions.mockImplementation(createUseQueryMock("success", { data: [SUB_1] }));
    mockedUseGetPriceById.mockImplementation(createUseQueryMock("success", { data: PRICE_2 }));
    render(<Component {...MINIMAL_PROPS} />, { wrapper });

    await waitFor(() => {
      expect(screen.getByRole("form")).not.toHaveAttribute("aria-busy", "true");
    });

    expect(screen.getByText(/changes to your subscription/i)).toBeVisible();
  })

  it("shows already subscribed when subbed to plan", async () => {
    mockedUseGetSubscriptions.mockImplementation(createUseQueryMock("success", { data: [SUB_1] }));
    mockedUseGetPriceById.mockImplementation(createUseQueryMock("success", { data: PRICE_1 }));
    render(<Component {...MINIMAL_PROPS} />, { wrapper });

    await waitFor(() => {
      expect(screen.getByRole("form")).not.toHaveAttribute("aria-busy", "true");
    });

    expect(screen.getByText(/you are already subscribed/i)).toBeVisible();
  })
})