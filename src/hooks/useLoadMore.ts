import "client-only";

import { useMemo, useState } from "react";


export type UseLoadMoreOptions = {
  increment?: number,
}

export default function useLoadMore<TData>(items: TData[] | undefined, initial: number = 0, { increment = 3 }: UseLoadMoreOptions = {}) {
  const _items = useMemo(
    () => Array.isArray(items) ? items : [],
    [items]
  );
  const [current, setCurrent] = useState(initial);

  const visible = useMemo(
    () => _items.slice(0, current),
    [_items, current]
  );
  const hasMore = useMemo(
    () => !!_items && _items.length > current,
    [_items, current]
  );

  const handlers = useMemo(
    () => ({
      increment: () => setCurrent(v => v + increment),
      decrement: () => setCurrent(v => Math.max(0, v - increment)),
      reset: () => setCurrent(initial),
    }),
    [initial, increment]
  );

  const incrementButtonProps = {
    onClick: handlers.increment,
    disabled: !hasMore,
    children: hasMore
      ? "Show more"
      : "End of list",
  };

  const decrementButtonProps = {
    onClick: handlers.decrement,
    children: "Show less",
  };

  const resetButtonProps = {
    onClick: handlers.reset,
    children: "Show less",
  };


  return {
    current,
    visible,
    hasMore,
    ...handlers,
    incrementButtonProps,
    decrementButtonProps,
    resetButtonProps,
  };
}
