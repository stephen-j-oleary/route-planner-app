import { throttle } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";

import { Box } from "@mui/material";


export default function ScrollResize({
  scroll,
  min = undefined,
  max = undefined,
  children,
} = {}) {
  const container = useRef(null);
  const spacer = useRef(null);
  const content = useRef(null);
  const [spacerHeight, setSpacerHeight] = useState("0%");
  const [contentHeight, setContentHeight] = useState("100%");

  const handleScroll = useCallback(
    e => {
      // Math.max ensures negative scroll value is not possible (scroll bounce may cause negative values)
      const scrollTop = Math.max(0, e.currentTarget?.scrollY || e.target?.scrollTop || 0);
      const containerHeight = container.current.clientHeight;

      setContentHeight(Math.max(0, containerHeight - scrollTop));
      setSpacerHeight(scrollTop);
    },
    []
  );

  useEffect(
    function addScrollListener() {
      const scrollContainer = scroll.current;
      if (!scrollContainer) return;
      const handler = throttle(handleScroll, 10, { trailing: true });
      scrollContainer.addEventListener("scroll", handler);
      return () => scrollContainer.removeEventListener("scroll", handler);
    },
    [scroll, handleScroll]
  );

  useEffect(
    function addResizeListener() {
      const containerCurrent = container.current;
      if (!containerCurrent) return;
      const handler = handleScroll;
      containerCurrent.addEventListener("resize", handler);
      return () => containerCurrent.removeEventListener("resize", handler);
    },
    [handleScroll]
  );

  return (
    <Box
      ref={container}
      style={{ height: max }}
    >
      <Box
        ref={spacer}
        style={{
          height: spacerHeight,
          maxHeight: `calc(100% - ${min})`,
        }}
      />
      <Box
        ref={content}
        style={{
          height: contentHeight,
          minHeight: min,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}