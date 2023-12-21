import { useEffect, useMemo, useRef } from "react";


type DeferObject<TData> = {
  promise?: Promise<TData>,
  resolve?: (value: unknown) => void,
  reject?: (reason?: unknown) => void,
};

export default function useDeferred<TData = unknown>(condition: boolean = null, resolveValue: TData = null) {
  const defer: DeferObject<TData> = {};
  defer.promise = new Promise((resolve, reject) => {
    defer.resolve = resolve;
    defer.reject = reject;
  });

  const deferRef = useRef(defer);

  const methods = useMemo(
    () => ({
      execute: () => deferRef.current.promise,
      resolve: (value: unknown) => deferRef.current.resolve(value),
      reject: (reason?: unknown) => deferRef.current.reject(reason),
    }),
    []
  );

  useEffect(
    function watchDeferredValue() {
      if (condition !== true) return;
      methods.resolve(resolveValue);
    },
    [condition, resolveValue, methods]
  );

  return {
    promise: deferRef.current.promise,
    ...methods
  };
}