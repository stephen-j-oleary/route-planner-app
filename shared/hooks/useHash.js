
import _ from "lodash";
import { useCallback, useEffect, useState } from "react";
import resolve from "../resolve.js";

const VALUE_PATH = "location.hash";

export default function useHash({ initialValue, defaultValue } = {}) {
  // Create values that wont change when props change
  const [initialValueConst] = useState(initialValue);

  const [value, setValue] = useState(null);

  const handleHashChange = useCallback(
    () => {
      setValue(_.get(window, VALUE_PATH, defaultValue));
    },
    [defaultValue]
  );

  // Get hash on first render
  useEffect(
    () => {
      handleHashChange();
    },
    [handleHashChange]
  );

  useEffect(
    () => {
      window.addEventListener("hashchange", handleHashChange);
      return () => window.removeEventListener("hashchange", handleHashChange);
    },
    [handleHashChange]
  );

  const handleSetValue = useCallback(
    newValue => {
      if (newValue === value) return;

      const computedNewValue = resolve(newValue, value);
      window.location.hash = computedNewValue;
    },
    [value]
  );

  useEffect(
    () => {
      if (initialValueConst !== undefined) handleSetValue(window.location.hash)
    },
    [initialValueConst, handleSetValue]
  );

  return [value, handleSetValue];
}
