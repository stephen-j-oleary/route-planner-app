import { getAllByRole, render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

import AddressInput from ".";

jest.mock("@/shared/hooks/useAddressSuggestions");

const MINIMAL_PROPS = {
  name: "address",
  onSelect: jest.fn(),
};


function setupForm() {
  const { result } = renderHook(() => useForm());
  return result.current;
}

describe("AddressInput", () => {
  it("has an input", () => {
    const form = setupForm();
    render(
      <AddressInput
        form={form}
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("combobox"));
  });

  it("starts with dropdown closed", () => {
    const form = setupForm();
    render(
      <AddressInput
        form={form}
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.queryByRole("presentation")).not.toBeInTheDocument();
  });

  it("has dropdown when focused", async () => {
    const form = setupForm();
    render(
      <AddressInput
        form={form}
        {...MINIMAL_PROPS}
      />
    );

    await userEvent.click(screen.getByRole("combobox"));

    expect(screen.getByRole("presentation")).toBeInTheDocument();
  });

  it("closes dropdown when blurred", async () => {
    const form = setupForm();
    const { container } = render(
      <AddressInput
        form={form}
        {...MINIMAL_PROPS}
      />
    );

    const input = screen.getByRole("combobox");
    await userEvent.click(input);
    await waitFor(() => {
      expect(screen.getByRole("presentation")).toBeInTheDocument();
    });
    await userEvent.click(container);

    await waitFor(() => {
      expect(screen.queryByRole("presentation")).not.toBeInTheDocument();
    });
  });

  it("calls onSelect when an option is clicked", async () => {
    const form = setupForm();
    render(
      <AddressInput
        form={form}
        {...MINIMAL_PROPS}
      />
    );

    const input = screen.getByRole("combobox");
    await userEvent.click(input);
    const dropdown = await screen.findByRole("presentation");
    const options = getAllByRole(dropdown, "option");
    await userEvent.click(options[0]);

    expect(MINIMAL_PROPS.onSelect).toBeCalledTimes(1);
  });

  it("has a loading indicator when an async option is loading", async () => {
    useMutation.mockReturnValueOnce({
      mutate: jest.fn(),
      isLoading: true,
      isError: false,
    });
    const form = setupForm();
    render(
      <AddressInput
        form={form}
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("has an error indicator when an async option fails loading", async () => {
    useMutation.mockReturnValueOnce({
      mutate: jest.fn(),
      isLoading: false,
      isError: true,
      error: "Error",
    });
    const form = setupForm();
    render(
      <AddressInput
        form={form}
        {...MINIMAL_PROPS}
      />
    );

    expect(screen.getByLabelText(/^error$/i)).toBeInTheDocument();
  });
});