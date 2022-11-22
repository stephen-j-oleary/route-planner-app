/* eslint-disable react-hooks/exhaustive-deps */

import { useCallback, useEffect } from "react";
import _ from "lodash";

export default function useDebounce(callback, wait, deps) {
  const debouncedCallback = useCallback(
    _.debounce(callback, wait),
    deps
  );

  useEffect(() => () => {
    debouncedCallback.cancel();
  }, []);

  return debouncedCallback;
}
