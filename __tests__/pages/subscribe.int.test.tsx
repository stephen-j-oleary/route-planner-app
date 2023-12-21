jest.mock("@/utils/auth/serverHelpers", () => ({
  getAuthUser: jest.fn(),
}));

import { render, screen } from "@testing-library/react";

import Page, { getServerSideProps } from "@/pages/subscribe/[...slug]";
import QueryClientProvider from "@/providers/QueryClientProvider";
import { getAuthUser } from "@/utils/auth/serverHelpers";
import createGetServerSidePropsContext from "__utils__/createGetServerSidePropsContext";

const mockedGetAuthUser = getAuthUser as jest.Mock;


const wrapper = QueryClientProvider;

describe("/subscribe", () => {
  mockedGetAuthUser.mockResolvedValue({ id: "user" });

  afterEach(() => jest.clearAllMocks());

  it("handles logged out", async () => {
    const resolvedUrl = "/current/page";
    mockedGetAuthUser.mockResolvedValueOnce(null);
    const result = await getServerSideProps(createGetServerSidePropsContext({ resolvedUrl }));

    expect(result).toHaveProperty("redirect", expect.objectContaining({
      destination: `/register?callbackUrl=${resolvedUrl}`,
      permanent: false,
    }));
  })

  it("server handles missing or invalid query params", async () => {
    const result = await getServerSideProps(createGetServerSidePropsContext({ params: { slug: [] } }));

    expect(result).toHaveProperty("notFound", true);
  })

  it("server handles price id param", async () => {
    const priceId = "price_id";
    const result = await getServerSideProps(createGetServerSidePropsContext({ params: { slug: ["id", priceId] } }));

    expect(result).toHaveProperty("props", expect.objectContaining({ priceId }));
  })

  it("server handles lookup key param", async () => {
    const lookupKey = "lookup_key";
    const result = await getServerSideProps(createGetServerSidePropsContext({ params: { slug: [lookupKey] } }));

    expect(result).toHaveProperty("props", expect.objectContaining({ lookupKey }));
  })

  it("renders the subscribe form", () => {
    render(<Page />, { wrapper });

    expect(screen.getByRole("form", { busy: true })).toBeVisible();
  })
})