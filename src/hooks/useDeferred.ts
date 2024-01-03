import { useEffect, useMemo, useRef } from "react";


class DeferObject<TData> {
  promise: Promise<TData>;
  _resolve?: (value: TData | PromiseLike<TData>) => void;
  _reject?: (reason?: unknown) => void;

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  resolve(value: TData | PromiseLike<TData>) {
    return this._resolve?.(value);
  }

  reject(reason?: unknown) {
    return this._reject?.(reason);
  }
}

export default function useDeferred<TData = undefined>(resolveValue: TData, condition: boolean = true) {
  const deferRef = useRef(new DeferObject<TData>());

  const methods = useMemo(
    () => ({
      execute: () => deferRef.current.promise,
      resolve: (value: TData | PromiseLike<TData>) => deferRef.current.resolve?.(value),
      reject: (reason?: unknown) => deferRef.current.reject?.(reason),
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