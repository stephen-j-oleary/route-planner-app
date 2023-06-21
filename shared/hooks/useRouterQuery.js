import { get as _get, set as _set, isArray, isNil } from "lodash";
import { useRouter } from "next/router";
import { useMemo } from "react";


export default function useRouterQuery() {
  const { isReady, ...router } = useRouter();

  const handlers = useMemo(
    () => ({
      /**
       * @param {string} [param]
       * @param {*} [defaultValue]
       * @returns {string|string[]|null}
       */
      get(param, defaultValue) {
        const value = _get(
          router,
          ["query", param].filter(v => v).join("."),
          defaultValue
        );

        return isNil(value)
          ? null
          : isArray(value)
          ? value.map(decodeURIComponent)
          : decodeURIComponent(value);
      },
      /**
       * @param {string} [param]
       * @param {*} [value]
       */
      set(param, value) {
        const newValues = _set(
          router,
          ["query", param].filter(v => v).join("."),
          isArray(value)
            ? value.map(encodeURIComponent)
            : encodeURIComponent(value)
        );

        router.replace(
          {
            pathname: router.pathname,
            query: newValues.query,
          },
          null,
          { shallow: true }
        );
      },
    }),
    [router]
  );

  return {
    ...handlers,
    isReady,
  };
}