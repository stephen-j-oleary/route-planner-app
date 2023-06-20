import { useEffect, useMemo, useRef } from "react";

/**
 * Creates the promise if not already created and returns it
 * @callback ExecuteFunction
 * @returns {Promise<*>}
 *
 *
 * Resolves the promise with the given value
 * @callback ResolveFunction
 * @param {*} value
 *
 *
 * Rejects the promise with the given reason
 * @callback RejectFunction
 * @param {*} reason
 *
 *
 * @typedef {Object} UseDeferredResult
 * @property {Promise} promise
 * @property {ExecuteFunction} execute
 * @property {ResolveFunction} resolve
 * @property {RejectFunction} reject
 */


/**
 * @param {boolean} [condition] The condition that must be met for the promise to be auto-resolved
 * @param {*} [resolveValue] The value to auto-resolve the promise with
 * @returns {UseDeferredResult}
 */
export default function useDeferred(condition = null, resolveValue = null) {
  const defer = {};
  defer.promise = new Promise((resolve, reject) => {
    defer.resolve = resolve;
    defer.reject = reject;
  });

  const deferRef = useRef(defer);

  const methods = useMemo(
    () => ({
      /** @type {ExecuteFunction} */
      execute() {
        return deferRef.current.promise;
      },
      /** @type {ResolveFunction} */
      resolve(value) {
        deferRef.current.resolve(value);
      },
      /** @type {RejectFunction} */
      reject(reason) {
        deferRef.current.reject(reason);
      }
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