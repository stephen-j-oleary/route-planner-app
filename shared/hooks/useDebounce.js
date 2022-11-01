/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useMemo } from "react";
import _ from "lodash";

export default function useDebounce(callback, wait, deps = []) {
  const debouncedCallback = useMemo(
    () => _.debounce(callback, wait),
    [callback, wait, ...deps]
  );

  useEffect(() => () => {
    debouncedCallback.cancel();
  }, []);

  return debouncedCallback;
}
