import { get as _get, set as _set, isArray, isString } from "lodash";
import { useRouter } from "next/router";
import { useMemo } from "react";


export default function useRouterQuery() {
  const { isReady, ...router } = useRouter();

  const handlers = useMemo(
    () => ({
      get<TDefaultValue = string | string[] | undefined>(param: string, defaultValue?: TDefaultValue) {
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
      set(param: string, value: string | string[]) {
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