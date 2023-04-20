
import { isEmpty, isFunction, isNil, omit } from "lodash";
import React, { useEffect, useId, useMemo, useState } from "react";

import LocationIcon from "@mui/icons-material/MyLocationRounded";

import useDebounce from "@/shared/hooks/useDebounce";
import usePosition from "@/shared/hooks/usePosition";
import usePrevious from "@/shared/hooks/usePrevious";
import { getAutocomplete } from "@/shared/services/autocomplete";

const SEARCH_RADIUS = 100_000; // 100 km
const SUGGESTIONS_LIMIT = 5; // 5 items


export default function useAddressSuggestions({
  id,
  query,
  show = false
}) {
  const internalId = useId();
  const _id = id || internalId;
  const [previousQuery, updatePreviousQuery] = usePrevious();
  const { permissionStatus, requestLocation } = usePosition();

  const placeholderSuggestion = useMemo(
    () => new Suggestion({
      isPlaceholder: true,
      primary: "Loading...",
    }),
    []
  );
  const currentLocationSuggestion = useMemo(
    () => new Suggestion({
      id: `${_id}_current-location`,
      primary: "Current Location",
      value: async () => {
        const location = await requestLocation();
        return location ? `${location.lat},${location.lng}` : null;
      },
      startIcon: <LocationIcon fontSize=".9rem" />,
    }),
    [_id, requestLocation]
  );
  const freeSoloSuggestion = useMemo(
    () => new Suggestion(
      !isEmpty(query) && {
        id: `${_id}_free-solo`,
        primary: query,
        value: query,
      }
    ),
    [_id, query]
  );

  const [quickSuggestions, setQuickSuggestions] = useState([]);
  useEffect(
    function updateQuickSuggestions() {
      if (!show) return;

      setQuickSuggestions([
        currentLocationSuggestion
      ]);
    },
    [show, currentLocationSuggestion]
  )

  const [autocompleteState, setAutocompleteState] = useState({
    loading: false,
    data: []
  });
  const [listSuggestions, setListSuggestions] = useState([]);
  const addressSuggestions = useMemo(
    () => (
      !autocompleteState.loading
        ? autocompleteState.data
        : [placeholderSuggestion]
    ),
    [autocompleteState.loading, autocompleteState.data, placeholderSuggestion]
  );

  useEffect(
    () => {
      if (!show) return;

      setListSuggestions([
        freeSoloSuggestion,
        ...addressSuggestions
      ].filter(v => !isNil(v)));
    },
    [show, freeSoloSuggestion, addressSuggestions]
  )

  const debouncedAutocomplete = useDebounce(async (query, successCallback, errorCallback) => {
    if (!query || isEmpty(query)) return successCallback([]);

    try {
      const location = (permissionStatus !== "prompt") && await requestLocation().catch(console.error);

      const autocomplete = await getAutocomplete({
        q: query,
        location: location
          ? `${location.lat},${location.lng}`
          : undefined,
        radius: location
          ? SEARCH_RADIUS
          : undefined,
        limit: SUGGESTIONS_LIMIT
      });

      const results = autocomplete.results.map(item => new Suggestion({
        id: `${_id}_${item.id}`,
        primary: item.main_text,
        secondary: item.secondary_text,
        value: item.full_text,
      }));

      successCallback(results);
    }
    catch (err) {
      errorCallback(err);
    }
  }, 1000, []);

  // Update suggestion items any time value changes
  useEffect(
    () => {
      let active = true;

      if (isEmpty(query)) return setAutocompleteState({ data: [], loading: false });
      if (!show || query === previousQuery) return setAutocompleteState(v => ({ ...v, loading: false }));
      setAutocompleteState(v => ({ ...v, loading: true }));

      debouncedAutocomplete(
        query,
        data => {
          if (!active) return;
          updatePreviousQuery(query);
          setAutocompleteState({ data, loading: false });
        },
        () => {
          setAutocompleteState(v => ({ ...v, loading: false }));
        }
      );

      return () => active = false;
    },
    [show, query, previousQuery, updatePreviousQuery, debouncedAutocomplete]
  );


  return {
    quickSuggestions,
    listSuggestions,
  };
}


class Suggestion {
  constructor({ id, value, primary, secondary, isPlaceholder, ...props }) {
    this.id = id;
    this.value = value;
    this.primary = primary;
    this.secondary = secondary;
    this.isPlaceholder = isPlaceholder;
    Object.assign(this, props);
  }

  getValue() {
    return isFunction(this.value)
      ? this.value()
      : this.value;
  }

  getProps() {
    return omit(this, "id", "value");
  }
}
