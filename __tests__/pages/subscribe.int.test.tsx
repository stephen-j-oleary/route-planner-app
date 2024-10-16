jest.mock("@/utils/auth", () => ({
  auth: jest.fn(),
}));

import { render, screen } from "@testing-library/react";

import Page from "@/app/subscribe/[...slug]/page";
import { auth } from "@/utils/auth";

const mockedAuth = auth as jest.Mock;


describe("/subscribe", () => {
  mockedAuth.mockResolvedValue({ session: { user: { id: "user" } } });

  afterEach(() => jest.clearAllMocks());

  it("renders the subscribe form", () => {
    render(<Page params={{ slug: ["slug"] }} searchParams={{}} />);

    expect(screen.getByRole("form", { busy: true })).toBeVisible();
  })
})