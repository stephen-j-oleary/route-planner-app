import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ProvidersList from ".";

jest.mock(
  "@/utils/auth/providerLogos",
  () => ({
    prov1: () => <div data-testid="prov1-icon-mock" />,
    prov2: () => <div data-testid="prov2-icon-mock" />,
  })
);

const handleProviderSubmit = jest.fn();
const MINIMAL_PROPS = { handleProviderSubmit };


describe("ProvidersList", () => {
  it("has buttons for each provider", () => {
    render(
      <ProvidersList
        {...MINIMAL_PROPS}
        providers={[
          { id: "prov1", name: "Provider 1" },
          { id: "prov2", name: "Provider 2" },
        ]}
      />
    );

    expect(screen.getAllByRole("button", { name: /provider/i })).toHaveLength(2);
  });

  it("has icons in each provider button", () => {
    render(
      <ProvidersList
        {...MINIMAL_PROPS}
        providers={[
          { id: "prov1", name: "Provider 1" },
          { id: "prov2", name: "Provider 2" },
        ]}
      />
    );

    expect(screen.getByTestId("prov1-icon-mock")).toBeInTheDocument();
    expect(screen.getByTestId("prov2-icon-mock")).toBeInTheDocument();
  });

  it("handles missing provider icons", () => {
    render(
      <ProvidersList
        {...MINIMAL_PROPS}
        providers={[
          { id: "prov3", name: "Provider 3" },
        ]}
      />
    );

    expect(screen.getByRole("button", { name: /provider/i })).toBeInTheDocument();
  });

  it("calls handleProviderSubmit callback with the provider id", async () => {
    const ID1 = "prov1";
    const ID2 = "prov2";
    render(
      <ProvidersList
        {...MINIMAL_PROPS}
        providers={[
          { id: ID1, name: "Provider 1" },
          { id: ID2, name: "Provider 2" },
        ]}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /provider 1/i }));
    expect(handleProviderSubmit).toBeCalledWith(ID1);

    await userEvent.click(screen.getByRole("button", { name: /provider 2/i }));
    expect(handleProviderSubmit).toBeCalledWith(ID2);
  });
});