import { useEffect, useMemo, useRef } from "react";

/**
 * Creates the promise if not already created and returns it
 * @callback ExecuteFunction
 * @returns {Promise<*>}
 *
 *
 * Creates the promise or cancels the promise if already created
 * @callback ForceExecuteFunction
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
 * @typedef {Object} UseDeferredMethods
 * @property {ExecuteFunction} execute
 * @property {ForceExecuteFunction} forceExecute
 * @property {ResolveFunction} resolve
 * @property {RejectFunction} reject
 */


/**
 * @param {Array<boolean>} conditions The conditions that must be met for the promise to be auto-resolved
 * @param {*} resolveValue The value to auto-resolve the promise with
 * @returns {UseDeferredMethods}
 */
export default function useDeferred(conditions = null, resolveValue = null) {
  const deferRef = useRef(null);

  const methods = useMemo(
    () => ({
      /** @type {ExecuteFunction} */
      execute() {
        return deferRef.current ? deferRef.current.promise : methods.forceExecute();
      },
      /** @type {ForceExecuteFunction} */
      forceExecute() {
        deferRef.current?.reject(new Error("Cancelled by forced execution"));

        const defer = {};
        defer.promise = new Promise((resolve, reject) => {
          defer.resolve = resolve;
          defer.reject = reject;
        });

        return (deferRef.current = defer).promise;
      },
      /** @type {ResolveFunction} */
      resolve(value) {
        if (!deferRef.current) return;

        deferRef.current.resolve(value);
        deferRef.current = null;
      },
      /** @type {RejectFunction} */
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