/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

/**
 * Creates a ref that stores the current value of the handler.
 * Useful for situation where you need to add the handler in a useEffect.
 * E.g. domRef.addEventListener(handler)
 */
export default function useEvent(handler: (...params: any[]) => void) {
  const handlerRef = React.useRef(handler);
  React.useEffect(() => { handlerRef.current = handler }, [handler]);

  return handlerRef;
}