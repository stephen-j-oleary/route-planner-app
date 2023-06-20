import { getAllByRole, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getProviders, signIn } from "next-auth/react";
import { QueryClient } from "react-query";

import LinkProvider from ".";
import QueryClientProvider from "@/shared/providers/QueryClientProvider";
import httpClient from "@/shared/utils/httpClient";

jest.unmock("react-query");
jest.mock("@/shared/utils/httpClient", () => ({
  request: jest.fn(),
}));


function wrapper(props) {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient} {...props} />;
}

const getTriggerButton = () => screen.getByRole("button", { name: /link provider\.\.\./i});
const getSubmitButtons = dialog => getAllByRole(dialog, "button", { name: /link with/i });

describe("LinkProvider", () => {
  it("properly handles the sign in flow", async () => {
    httpClient.request.mockResolvedValue({
      data: [{
        _id: "account_id",
        provider: "credentials",
        credentials: {
          email: "example@email.com",
          password: "CurrentPassword1",
        },
      }],
    });
    getProviders.mockResolvedValue({
      google: {
        id: "google",
        name: "Google",
      },
    });

    render(
      <LinkProvider />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getTriggerButton()).toBeInTheDocument();
    });
    await userEvent.click(getTriggerButton());

    const dialog = await screen.findByRole("dialog");

    await userEvent.click(getSubmitButtons(dialog)[0]);

    await waitFor(() => {
      expect(signIn).toBeCalledWith(expect.any(String));
    });
  });
})