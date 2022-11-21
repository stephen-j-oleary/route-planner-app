
import _ from "lodash";
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
      if (_.isNil(watch)) return;
      ref.current = watch;
    },
    [watch]
  );

  return [ref.current, handleUpdate];
}
