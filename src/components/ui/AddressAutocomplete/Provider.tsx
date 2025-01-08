import { createContext, ReactNode, RefObject, useContext, useRef } from "react";


export type TAddressAutocompleteContext = {
  quickSuggestionsRef: RefObject<HTMLDivElement>,
};

export const AddressAutocompleteContext = createContext<TAddressAutocompleteContext>({
  quickSuggestionsRef: { current: null },
});


export default function AddressAutocompleteProvider(props: {
  children: ReactNode,
}) {
  const quickSuggestionsRef = useRef<HTMLDivElement>(null);

  return (
    <AddressAutocompleteContext.Provider
      value={{ quickSuggestionsRef }}
      {...props}
    />
  );
}


export function useAddressAutocompleteContext() {
  const ctx = useContext(AddressAutocompleteContext);
  return ctx;
}