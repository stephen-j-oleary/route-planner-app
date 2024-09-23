import "client-only";

import React from "react";
import { useDebounce } from "@uidotdev/usehooks";

import { parseCoordinate } from "@/utils/coords";
import { getAutocomplete } from "@/app/api/autocomplete/actions";
import usePosition from "@/hooks/usePosition";

const DEBOUNCE_DELAY_MS = 500;


export type AddressAutocompleteOption = {
  fullText?: string,
  mainText?: string,
  secondaryText?: string,
  coordinates?: string,
  isQuick?: boolean,
  isPending?: boolean,
  icon?: React.ReactNode,
  onClick?: () => void,
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
  const [result, action, isFetching] = React.useActionState<(AddressAutocompleteOption | "")[], string>(
    async (prevState: any, q: string) => (await getAutocomplete({ q })).results,
    []
  );
  const debouncedQ = useDebounce(q, DEBOUNCE_DELAY_MS);

  const [data, setData] = React.useState<(AddressAutocompleteOption | "")[]>([]);

  React.useEffect(
    () => {
      if (!debouncedQ || (value?.fullText && [q, debouncedQ].includes(value.fullText) && hasCoordinate(value))) return;
      React.startTransition(() => action(debouncedQ));
    },
    [q, debouncedQ, value]
  );

  React.useEffect(
    () => setData(result),
    [result]
  );

  return {
    isFetching: isFetching || (q && q !== debouncedQ && q !== value?.fullText),
    data,
  };
}

export function useCurrentLocation() {
  const position = usePosition();

  const [result, action, isFetching] = React.useActionState(
    () => position.request(),
    null,
  );

  const [data, setData] = React.useState<string | null>(null);

  React.useEffect(
    () => {
      if (!result) return;

      const { lat, lng } = result;
      const coordinates = `${lat}, ${lng}`;
      setData(coordinates);
    },
    [result]
  );

  const fetch = () => {
    React.startTransition(() => action());
  };

  return {
    data,
    isFetching,
    fetch,
  };
}