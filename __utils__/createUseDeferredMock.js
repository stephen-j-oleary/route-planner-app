export default function createUseDeferredMock({ resolved, rejected } = {}) {
  return (_, resolveValue) => ({
    execute() {
      return resolved
        ? Promise.resolve(resolveValue)
        : rejected
        ? Promise.reject(rejected)
        : new Promise(() => {});
    },
    forceExecute: () => {},
    resolve: () => {},
    reject: () => {},
  });
}