import { getByLabelText, getByRole, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getProviders, signIn, useSession } from "next-auth/react";
import { QueryClient } from "react-query";

import UnlinkProvider from ".";
import QueryClientProvider from "@/providers/QueryClientProvider";
import httpClient from "@/utils/httpClient";

jest.unmock("react-query");
jest.mock("@/utils/httpClient", () => ({
  request: jest.fn(),
}));

const PROVIDER_ACCOUNT_ID = "provider_account_id";
const EMAIL = "example@email.com";
const PASSWORD = "NewPassword1";


function wrapper(props) {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient} {...props} />;
}

const getTriggerButton = () => screen.getByRole("button", { name: /unlink from .+\.\.\./i});
const getPasswordInput = dialog => getByLabelText(dialog, /new password/i);
const getSubmitButton = dialog => getByRole(dialog, "button", { name: /create password and unlink provider/i });

describe("UnlinkProvider", () => {
  beforeEach(jest.clearAllMocks);

  it("properly updates the accounts", async () => {
    getProviders.mockResolvedValue({
      google: {
        id: "google",
        name: "Google",
      },
    });
    httpClient.request.mockResolvedValue({
      data: [{
        _id: PROVIDER_ACCOUNT_ID,
        provider: "google",
      }],
    });
    useSession.mockReturnValue({
      status: "success",
      data: {
        user: { email: EMAIL },
      },
    });

    render(
      <UnlinkProvider />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getTriggerButton()).toBeInTheDocument();
    });
    await userEvent.click(getTriggerButton());

    const dialog = await screen.findByRole("dialog");

    await userEvent.clear(getPasswordInput(dialog));
    await userEvent.type(getPasswordInput(dialog), PASSWORD);

    await userEvent.click(getSubmitButton(dialog));

    await waitFor(() => {
      expect(signIn).toBeCalledWith("credentials", {
        email: EMAIL,
        password: PASSWORD,
        redirect: false,
      });
    });

    await waitFor(() => {
      expect(httpClient.request).toBeCalledWith({
        url: `api/accounts/${PROVIDER_ACCOUNT_ID}`,
        method: expect.stringMatching(/delete/i),
      });
    });
  });
});