import { useEffect, useMemo, useRef } from "react";


export default function useDeferred(conditions = null, resolveValue = null) {
  const deferRef = useRef(null);

  const methods = useMemo(
    () => ({
      execute() {
        return deferRef.current ? deferRef.current.promise : methods.forceExecute();
      },
      forceExecute() {
        deferRef.current?.reject(new Error("Canceled by forced execution"));

        const defer = {};
        defer.promise = new Promise((resolve, reject) => {
          defer.resolve = resolve;
          defer.reject = reject;
        });

        return (deferRef.current = defer).promise;
      },
      resolve(value) {
        if (!deferRef.current) return;

        deferRef.current.resolve(value);
        deferRef.current = null;
      },
      reject(reason) {
        if (!deferRef.current) return;

        deferRef.current.reject(reason);
        deferRef.current = null;
      }
    }),
    []
  );

  useEffect(
    function watchDeferredValue() {
      if (!conditions || !conditions.every(cond => cond === true)) return;
      methods.resolve(resolveValue);
    },
    [conditions, resolveValue, methods]
  );

  return methods;
}