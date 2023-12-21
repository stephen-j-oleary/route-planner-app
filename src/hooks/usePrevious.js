import { isEqual } from "lodash";
import { useCallback, useEffect, useRef } from "react";


export default function usePrevious(value, { watch = true, deepEqual = false } = {}) {
  const ref = useRef();

  const updateRef = useCallback(
    value => {
      if (deepEqual && isEqual(ref.current, value)) return;
      ref.current = value;
    },
    [deepEqual]
  );

  const handleUpdate = useCallback(
    value => updateRef(value),
    [updateRef]
  );

  useEffect(
    () => {
      if (!watch) return;
      updateRef(value);
    },
    [watch, updateRef, value]
  );

  return [ref.current, handleUpdate];
}