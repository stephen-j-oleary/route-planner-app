import { render, screen, waitFor } from "@testing-library/react";

import ProfileForm from ".";


describe("ProfileForm", () => {
  it("has a name input", () => {
    render(<ProfileForm />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  it("disables inputs when form is loading", () => {
    render(<ProfileForm />);

    expect(screen.getByLabelText(/name/i)).toBeDisabled();
  });

  it("enables inputs when form is not loading", async () => {
    render(<ProfileForm />);

    expect(screen.getByLabelText(/name/i)).toBeEnabled();
  });

  it("shows an alert when submit is successful", async () => {
    render(<ProfileForm />);

    expect(await screen.findByText(/changes saved/i)).toBeInTheDocument();
  });

  it("shows an alert when submit fails", async () => {
    render(<ProfileForm />);

    expect(await screen.findByText(/an error occurred/i)).toBeInTheDocument();
  });

  it("hides save button when form values have not changed", () => {
    render(<ProfileForm />);

    expect(screen.queryByRole("button", { name: /save/i })).not.toBeInTheDocument();
  });

  it("shows save button when form values have changed", async () => {
    render(<ProfileForm />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    });
  });
});