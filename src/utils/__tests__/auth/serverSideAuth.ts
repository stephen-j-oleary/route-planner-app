/** @jest-environment node */

import { getAuthUser } from "@/utils/auth/serverHelpers";
import serverSideAuth, { ServerSideAuthContext } from "@/utils/auth/serverSideAuth";

jest.mock("@/utils/auth/serverHelpers");

const mockedGetAuthUser = getAuthUser as jest.Mock;


describe("serverSideAuth", () => {
  const req = {} as ServerSideAuthContext["req"];
  const res = {} as ServerSideAuthContext["res"];
  const query = {} as ServerSideAuthContext["query"];
  const resolvedUrl = "https://url.com/page";
  const context = { req, res, query, resolvedUrl };

  const noUser = "/no-user";
  const hasUser = "/has-user";
  const notVerified = "/not-verified";
  const isVerified = "/is-verified";

  it("returns null when no redirects are passed", async () => {
    const result = await serverSideAuth(context, {});

    expect(result).toBe(null);
  })

  it("returns noUser redirect as expected", async () => {
    mockedGetAuthUser.mockResolvedValueOnce(null);

    const result = await serverSideAuth(context, { noUser });

    expect(result).toEqual({ redirect: { destination: expect.stringContaining(noUser), permanent: false } });
  })

  it("returns null when noUser redirect is not passed", async () => {
    mockedGetAuthUser.mockResolvedValueOnce(null);

    const result = await serverSideAuth(context, {});

    expect(result).toBe(null);
  })

  it("returns hasUser redirect as expected", async () => {
    const result = await serverSideAuth(context, { hasUser });

    expect(result).toEqual({ redirect: { destination: expect.stringContaining(hasUser), permanent: false } });
  })

  it("returns null when hasUser redirect is not passed", async () => {
    const result = await serverSideAuth(context, {});

    expect(result).toBe(null);
  })

  it("returns notVerified redirect as expected", async () => {
    const result = await serverSideAuth(context, { notVerified });

    expect(result).toEqual({ redirect: { destination: expect.stringContaining(notVerified), permanent: false } });
  })

  it("returns null when notVerified is not passed", async () => {
    const result = await serverSideAuth(context, {});

    expect(result).toBe(null);
  })

  it("returns isVerified redirect as expected", async () => {
    mockedGetAuthUser.mockResolvedValueOnce({ emailVerified: 102942 });

    const result = await serverSideAuth(context, { isVerified });

    expect(result).toEqual({ redirect: { destination: expect.stringContaining(isVerified), permanent: false } });
  })

  it("returns null when isVerified is not passed", async () => {
    mockedGetAuthUser.mockResolvedValueOnce({ emailVerified: 102942 });

    const result = await serverSideAuth(context, {});

    expect(result).toBe(null);
  })

  it("adds the callbackUrl if passed", async () => {
    const callbackUrl = "callbackUrl";
    const result = await serverSideAuth({ ...context, query: { callbackUrl } }, { hasUser });

    expect(result?.redirect).toHaveProperty("destination", expect.stringContaining(`callbackUrl=${callbackUrl}`));
  })

  it("adds the resolvedUrl if no callbackUrl passed", async () => {
    const result = await serverSideAuth(context, { hasUser });

    expect(result?.redirect).toHaveProperty("destination", expect.stringContaining(`callbackUrl=${resolvedUrl}`));
  })

  it("omits the callbackUrl if passed disableCallbackUrl", async () => {
    const result = await serverSideAuth({ ...context, disableCallbackUrl: true }, { hasUser });

    expect(result?.redirect).toHaveProperty("destination", hasUser);
  })
})