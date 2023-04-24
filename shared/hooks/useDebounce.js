/* eslint-disable react-hooks/exhaustive-deps */
import { debounce } from "lodash";
import { useCallback, useEffect } from "react";


export default function useDebounce(callback, wait, deps) {
  const debouncedCallback = useCallback(
    debounce(callback, wait),
    deps
  );

  useEffect(() => () => {
    debouncedCallback.cancel();
  }, []);

  return debouncedCallback;
}