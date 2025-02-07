import "client-only";

import { useDebounce } from "@uidotdev/usehooks";
import { ReactNode, startTransition, useActionState, useEffect } from "react";

import { getAutocomplete } from "@/app/api/autocomplete/actions";
import { parseCoordinate } from "@/utils/coords";

const DEBOUNCE_DELAY_MS = 400;


export type AddressAutocompleteOption = {
  fullText?: string,
  mainText?: string,
  secondaryText?: string,
  coordinates?: string,
  group?: string,
  icon?: ReactNode,
  action?: () => Promise<Partial<AddressAutocompleteOption> | undefined>,
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
  const [result, action, isFetching] = useActionState<{ error?: string, results: (AddressAutocompleteOption | "")[] }, string>(
    async (prevState: unknown, q: string) => {
      try {
        const { results } = await getAutocomplete({ q });
        return { results };
      }
      catch (err) {
        if (err instanceof Error) console.error(err.message);
        return { error: "Something went wrong", results: [] };
      }
    },
    { results: [] }
  );
  const debouncedQ = useDebounce(q, DEBOUNCE_DELAY_MS);

  useEffect(
    () => {
      if (!debouncedQ || (value?.fullText && [q, debouncedQ].includes(value.fullText) && hasCoordinate(value))) return;
      startTransition(() => action(debouncedQ));
    },
    [q, debouncedQ, value, action]
  );

  return {
    isFetching: isFetching || (q && q !== debouncedQ && q !== value?.fullText),
    error: result.error,
    data: result.results,
  };
}