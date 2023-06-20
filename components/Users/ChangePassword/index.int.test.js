import { getByLabelText, getByRole, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient } from "react-query";

import ChangePassword from ".";
import QueryClientProvider from "@/shared/providers/QueryClientProvider";
import httpClient from "@/shared/utils/httpClient";

jest.unmock("react-query");
jest.mock("@/shared/utils/httpClient", () => ({
  request: jest.fn(),
}));

const CURRENT_USER = {
  _id: "account_id",
  email: "example@email.com",
  password: "CurrentPassword1",
};
const NEW_PASSWORD = "NewPassword1";


function wrapper(props) {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient} {...props} />;
}

const getTriggerButton = () => screen.getByRole("button", { name: /change password\.\.\./i});
const getCurrentPasswordInput = dialog => getByLabelText(dialog, /current password/i);
const getNewPasswordInput = dialog => getByLabelText(dialog, /new password/i);
const getSubmitButton = dialog => getByRole(dialog, "button", { name: /change password/i });

describe("ChangePassword", () => {
  beforeEach(jest.clearAllMocks);

  it("properly updates the account", async () => {
    httpClient.request.mockResolvedValue({
      data: [{
        _id: CURRENT_USER._id,
        provider: "credentials",
        credentials: {
          email: CURRENT_USER.email,
        },
      }],
    });

    render(
      <ChangePassword />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getTriggerButton()).not.toBeDisabled();
    });
    await userEvent.click(getTriggerButton());

    const dialog = await screen.findByRole("dialog");

    await userEvent.clear(getCurrentPasswordInput(dialog));
    await userEvent.type(getCurrentPasswordInput(dialog), CURRENT_USER.password);

    await userEvent.clear(getNewPasswordInput(dialog));
    await userEvent.type(getNewPasswordInput(dialog), NEW_PASSWORD);

    await userEvent.click(getSubmitButton(dialog));

    expect(httpClient.request).toBeCalledWith({
      url: `api/accounts/${CURRENT_USER._id}/credentials`,
      method: expect.stringMatching(/patch/i),
      data: {
        email: CURRENT_USER.email,
        password: NEW_PASSWORD,
        oldCredentials: {
          email: CURRENT_USER.email,
          password: CURRENT_USER.password,
        },
      },
    });
  });
});