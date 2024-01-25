import { get as _get, set as _set, isArray, isNil, isString, omitBy } from "lodash";
import { useRouter } from "next/router";
import { useMemo } from "react";


export default function useRouterQuery() {
  const { isReady, ...router } = useRouter();

  const handlers = useMemo(
    () => ({
      get<TDefaultValue = string | string[]>(param: string, defaultValue?: TDefaultValue) {
        const value: string | string[] | typeof defaultValue = _get(
          router,
          ["query", param].filter(v => v).join("."),
          defaultValue
        );

        return isString(value)
          ? decodeURIComponent(value)
          : isArray(value)
          ? value.map(decodeURIComponent)
          : value
      },
      set(param: string, value: string | number | boolean | undefined | (string | number | boolean)[]) {
        const newValues = _set(
          router,
          ["query", param].filter(v => v).join("."),
          isNil(value)
            ? null
            : isArray(value)
            ? value.map(encodeURIComponent)
            : encodeURIComponent(value)
        );

        router.replace(
          {
            pathname: router.pathname,
            query: omitBy(newValues.query, isNil),
          },
          undefined,
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