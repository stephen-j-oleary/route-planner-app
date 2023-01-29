
import { isNil } from "lodash";
import { useCallback, useEffect, useRef } from "react";

export default function usePrevious(watch) {
  const ref = useRef();

  const handleUpdate = useCallback(
    value => {
      ref.current = value;
    },
    []
  );

  useEffect(
    () => {
      if (isNil(watch)) return;
      ref.current = watch;
    },
    [watch]
  );

  return [ref.current, handleUpdate];
}
