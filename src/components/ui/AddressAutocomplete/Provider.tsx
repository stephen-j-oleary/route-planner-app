import React from "react";


export type TAddressAutocompleteContext = {
  quickSuggestionsRef: React.RefObject<HTMLDivElement>,
};

export const AddressAutocompleteContext = React.createContext<TAddressAutocompleteContext>({
  quickSuggestionsRef: { current: null },
});


export default function AddressAutocompleteProvider(props: {
  children: React.ReactNode,
}) {
  const quickSuggestionsRef = React.useRef<HTMLDivElement>(null);

  return (
    <AddressAutocompleteContext.Provider
      value={{ quickSuggestionsRef }}
      {...props}
    />
  );
}


export function useAddressAutocompleteContext() {
  const ctx = React.useContext(AddressAutocompleteContext);
  return ctx;
}