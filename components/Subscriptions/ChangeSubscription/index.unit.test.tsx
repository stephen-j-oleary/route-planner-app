import { render, screen } from "@testing-library/react";

import ChangeSubscription from ".";


describe("ChangeSubscription", () => {
  it("is a menuitem", () => {
    render(<ChangeSubscription />);

    expect(screen.getByRole("menuitem", { name: /change subscription/i })).toBeInTheDocument();
  });

  it("links to the plans page", () => {
    render(<ChangeSubscription />);

    const href = "/plans";
    expect(screen.getByRole("menuitem")).toHaveAttribute("href", href);
  });
});