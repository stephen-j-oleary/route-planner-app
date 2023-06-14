/**
 * @typedef {Object} CreateUseDeferredMockOptions
 * @property {("resolved"|"rejected"|"pending")} status
 * @property {*} rejectReason
 */

/**
 * @param {CreateUseDeferredMockOptions} [options]
 */
export default function createUseDeferredMock({ status = "resolved", rejectReason } = {}) {
  return (_, resolveValue) => ({
    execute() {
      return status === "resolved"
        ? Promise.resolve(resolveValue)
        : status === "rejected"
        ? Promise.reject(rejectReason)
        : new Promise(() => {});
    },
    forceExecute: () => {},
    resolve: () => {},
    reject: () => {},
  });
}