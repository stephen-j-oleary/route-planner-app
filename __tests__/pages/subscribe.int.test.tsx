jest.mock("@/utils/auth", () => ({
  auth: jest.fn(),
}));

import { render, screen } from "@testing-library/react";

import Page from "@/app/subscribe/[...slug]/page";
import QueryClientProvider from "@/providers/QueryClientProvider";
import { auth } from "@/utils/auth";

const mockedAuth = auth as jest.Mock;


const wrapper = QueryClientProvider;

describe("/subscribe", () => {
  mockedAuth.mockResolvedValue({ session: { user: { id: "user" } } });

  afterEach(() => jest.clearAllMocks());

  it("renders the subscribe form", () => {
    render(<Page params={{ slug: ["slug"] }} searchParams={{}} />, { wrapper });

    expect(screen.getByRole("form", { busy: true })).toBeVisible();
  })
})