import { useMemo, useState } from "react";

import { Button } from "@mui/material";


export default function useLoadMore(items, initial = 0, { increment = 3, buttonComponent: ButtonComponent = Button } = {}) {
  const [current, setCurrent] = useState(initial);

  const visible = useMemo(
    () => (Array.isArray(items) ? items : []).slice(0, current),
    [items, current]
  );
  const hasMore = useMemo(
    () => !!items && items.length > current,
    [items, current]
  );

  const handlers = useMemo(
    () => ({
      increment: () => setCurrent(v => v + increment),
      decrement: () => setCurrent(v => Math.max(0, v - increment)),
      reset: () => setCurrent(initial),
    }),
    [initial, increment]
  );

  const IncrementButton = (props) => (
    <ButtonComponent
      onClick={handlers.increment}
      disabled={!hasMore}
      {...props}
    >
      {
        hasMore
          ? "Show more"
          : "End of list"
      }
    </ButtonComponent>
  );

  const DecrementButton = (props) => (
    <ButtonComponent
      onClick={handlers.decrement}
      {...props}
    >
      Show less
    </ButtonComponent>
  );

  const ResetButton = (props) => (
    <ButtonComponent
      onClick={handlers.reset}
      {...props}
    >
      Show less
    </ButtonComponent>
  );


  return {
    current,
    visible,
    hasMore,
    ...handlers,
    IncrementButton,
    DecrementButton,
    ResetButton,
  };
}
