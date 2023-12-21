import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useSession } from "next-auth/react";
import { QueryClient } from "react-query";

import ProfileForm from ".";
import QueryClientProvider from "@/providers/QueryClientProvider";
import httpClient from "@/utils/httpClient";

jest.unmock("react-query");
jest.mock("@/utils/httpClient", () => ({
  request: jest.fn(),
}));

const CURRENT_USER = {
  _id: "_id",
  name: "Old Name",
};
const NEW_USER = {
  name: "New Name",
};


function wrapper(props) {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient} {...props} />;
}

const getNameInput = () => screen.getByLabelText(/name/i);
const getSubmitButton = () => screen.getByRole("button", { name: /save/i });

describe("UserProfileForm", () => {
  it("properly updates the user", async () => {
    httpClient.request.mockResolvedValue({
      data: {},
    });
    useSession.mockReturnValue({
      status: "authenticated",
      data: { user: CURRENT_USER },
    });
    render(
      <ProfileForm />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getNameInput()).toBeEnabled();
    });

    await userEvent.clear(getNameInput());
    await userEvent.type(getNameInput(), NEW_USER.name);

    await waitFor(() => {
      expect(getSubmitButton()).toBeEnabled();
    });

    await userEvent.click(getSubmitButton());

    expect(httpClient.request).toBeCalledWith({
      url: `api/users/${CURRENT_USER._id}`,
      method: expect.stringMatching(/patch/i),
      data: NEW_USER,
    });
  });
});