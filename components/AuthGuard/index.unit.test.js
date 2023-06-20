import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";

import AuthGuard from ".";

const SIGN_IN_FORM_ID = "sign-in-form";

jest.mock(
  "@/components/SignInForm",
  () => (
    function SignInFormMock() {
      return <div data-testid={SIGN_IN_FORM_ID} />;
    }
  )
);


describe("AuthGuard", () => {
  it("shows loading indicator when loading authentication", () => {
    useSession.mockReturnValueOnce({ status: "loading" });
    render(<AuthGuard />);

    expect(screen.getByRole("progressbar")).toBeVisible();
  });

  it("shows sign in form when unauthenticated", () => {
    useSession.mockReturnValueOnce({ status: "unauthenticated" });
    render(<AuthGuard />);

    expect(screen.getByTestId(SIGN_IN_FORM_ID)).toBeVisible();
  });

  it("shows children when authenticated", () => {
    const CHILD_ID = "child-id";
    render(
      <AuthGuard>
        <div data-testid={CHILD_ID} />
      </AuthGuard>
    );

    expect(screen.getByTestId(CHILD_ID)).toBeVisible();
  });
});