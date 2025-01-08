import "client-only";

import { useDebounce } from "@uidotdev/usehooks";
import { FunctionComponent, ReactNode, startTransition, useActionState, useEffect, useState } from "react";

import { AddressAutocompleteSuggestionProps } from "./Suggestion";
import { getAutocomplete } from "@/app/api/autocomplete/actions";
import { parseCoordinate } from "@/utils/coords";

const DEBOUNCE_DELAY_MS = 500;


export type AddressAutocompleteOption = {
  group?: "main" | "quick",
  fullText?: string,
  mainText?: string,
  secondaryText?: string,
  coordinates?: string,
  isPending?: boolean,
  icon?: ReactNode,
  onClick?: () => void,
  Component?: FunctionComponent<AddressAutocompleteSuggestionProps>,
};


export function hasCoordinate(addr: Partial<AddressAutocompleteOption> | string) {
  const coord = parseCoordinate(
    typeof addr === "string"
      ? addr
      : (addr?.coordinates || addr?.fullText)
  );
  return !!coord;
}

export function useAddressAutocomplete(q: string, value?: Partial<AddressAutocompleteOption> | undefined | null) {
  const [result, action, isFetching] = useActionState<(AddressAutocompleteOption | "")[], string>(
    async (prevState: unknown[], q: string) => (await getAutocomplete({ q })).results,
    []
  );
  const debouncedQ = useDebounce(q, DEBOUNCE_DELAY_MS);

  const [data, setData] = useState<(AddressAutocompleteOption | "")[]>([]);

  useEffect(
    () => {
      if (!debouncedQ || (value?.fullText && [q, debouncedQ].includes(value.fullText) && hasCoordinate(value))) return;
      startTransition(() => action(debouncedQ));
    },
    [q, debouncedQ, value, action]
  );

  useEffect(
    () => setData(result),
    [result]
  );

  return {
    isFetching: isFetching || (q && q !== debouncedQ && q !== value?.fullText),
    data,
  };
}