import { render, screen } from "@testing-library/react";
import { signIn, useSession } from "next-auth/react";

import AuthGuard from ".";

jest.mock("next-auth/react");

const mockedUseSession = useSession as jest.Mock;
const mockedSignIn = signIn as jest.Mock;


const CHILD_TESTID = "child-test";
const children = <div data-testid={CHILD_TESTID} />;

describe("AuthGuard", () => {
  it("shows loading indicator when loading authentication", () => {
    mockedUseSession.mockReturnValueOnce({ status: "loading" });
    render(<AuthGuard>{children}</AuthGuard>);

    expect(screen.getByRole("progressbar")).toBeVisible();
  });

  it("redirects to sign in when unauthenticated", () => {
    mockedUseSession.mockReturnValueOnce({ status: "unauthenticated" });
    render(<AuthGuard>{children}</AuthGuard>);

    expect(mockedSignIn).toHaveBeenCalledTimes(1);
  });

  it("shows children when authenticated", () => {
    render(<AuthGuard>{children}</AuthGuard>);

    expect(screen.getByTestId(CHILD_TESTID)).toBeVisible();
  });
});