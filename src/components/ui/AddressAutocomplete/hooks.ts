import "client-only";

import { useDebounce } from "@uidotdev/usehooks";
import { ReactNode, startTransition, useActionState, useEffect } from "react";

import { getAutocomplete } from "@/app/api/autocomplete/actions";
import { parseCoordinate } from "@/utils/coords";

const DEBOUNCE_DELAY_MS = 400;


export type AddressAutocompleteOption = {
  fullText: string,
  mainText?: string,
  secondaryText?: string,
  coordinates: string,
  icon?: ReactNode,
  action?: () => Promise<Pick<AddressAutocompleteOption, "fullText" | "coordinates"> | undefined>,
};


export function hasCoordinate(addr: Partial<AddressAutocompleteOption> | string) {
  const coord = parseCoordinate(
    typeof addr === "string"
      ? addr
      : (addr?.coordinates || addr?.fullText)
  );
  return !!coord;
}

export function useAddressAutocomplete(query: string, value: Partial<AddressAutocompleteOption> | undefined | null) {
  const [result, action, isFetching] = useActionState(
    async (prevState: unknown, q: string) => {
      try {
        if (value && q === value.fullText && hasCoordinate(value)) return { results: [] };
        const { results = [] } = q ? await getAutocomplete({ q }) : {};
        return { results };
      }
      catch (err) {
        if (err instanceof Error) console.error(err.message);
        return { error: "Something went wrong" };
      }
    },
    null
  );
  const debouncedQ = useDebounce(query, DEBOUNCE_DELAY_MS);

  useEffect(
    () => startTransition(() => action(debouncedQ)),
    [debouncedQ, action]
  );

  return {
    isFetching,
    error: result?.error,
    query: debouncedQ,
    data: result?.results ?? null,
  };
}