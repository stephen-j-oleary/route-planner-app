/**
 * @typedef {Object} CreateUseDeferredMockOptions
 * @property {("resolved"|"rejected"|"pending")} status
 * @property {*} rejectReason
 */

/**
 * @param {CreateUseDeferredMockOptions} [options]
 */
export default function createUseDeferredMock({ status = "resolved", rejectReason } = {}) {
  return (_, resolveValue) => {
    const promise = status === "resolved"
      ? Promise.resolve(resolveValue)
      : status === "rejected"
      ? Promise.reject(rejectReason)
      : new Promise(() => {});

    const methods = {
      execute: () => promise,
      resolve: () => {},
      reject: () => {},
    };

    return {
      promise,
      ...methods,
    }
  }
}