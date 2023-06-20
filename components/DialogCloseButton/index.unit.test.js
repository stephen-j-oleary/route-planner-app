import { render, screen } from "@testing-library/react";

import DialogCloseButton from ".";


describe("DialogCloseButton", () => {
  it("is a button", () => {
    render(<DialogCloseButton />);

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("is a close icon", () => {
    render(<DialogCloseButton />);

    expect(screen.getByTestId("CloseOutlinedIcon")).toBeInTheDocument();
  });
});