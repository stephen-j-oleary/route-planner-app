import { QueryClient } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ProfileForm from ".";
import pages from "@/pages";
import QueryClientProvider from "@/providers/QueryClientProvider";

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

describe("ProfileForm", () => {
  it("properly updates the user", async () => {
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

    expect(fetch).toBeCalledWith({
      url: `${pages.api.users}/${CURRENT_USER._id}`,
      method: expect.stringMatching(/patch/i),
      data: NEW_USER,
    });
  });
});