import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useSession } from "next-auth/react";
import { QueryClient } from "react-query";

import ProfileForm from ".";
import QueryClientProvider from "@/shared/providers/QueryClientProvider";
import { updateUserById } from "@/shared/services/users";

jest.unmock("react-query");
jest.mock("@/shared/services/users", () => ({
  updateUserById: jest.fn(),
}));

const OLD_USER = {
  _id: "_id",
  name: "Old Name",
};
const NEW_USER = {
  name: "New Name",
};


function Container(props) {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient} {...props} />;
}

const getNameInput = () => screen.getByLabelText(/name/i);
const getSubmitButton = () => screen.getByRole("button", { name: /save/i });

describe("UserProfileForm", () => {
  it("properly updates the user", async () => {
    useSession.mockReturnValue({
      status: "authenticated",
      data: { user: OLD_USER },
    });
    render(
      <ProfileForm />,
      { wrapper: Container }
    );

    await waitFor(() => {
      expect(getNameInput()).not.toBeDisabled();
    });

    await userEvent.clear(getNameInput());
    await userEvent.type(getNameInput(), NEW_USER.name);

    await waitFor(() => {
      expect(getSubmitButton()).not.toBeDisabled();
    });

    await userEvent.click(getSubmitButton());

    expect(updateUserById).toBeCalledWith("_id", NEW_USER);
  });
});