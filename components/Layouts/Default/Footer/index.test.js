import { render, screen } from "@testing-library/react";

import Footer from ".";


describe("Footer", () => {
  it("is a footer", () => {
    render(<Footer />);

    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});