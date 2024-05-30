import "client-only";

import { throttle } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { Box } from "@mui/material";


export type ScrollResizeProps = {
  scrollContainer?: React.MutableRefObject<HTMLDivElement>,
  min?: string,
  max?: string,
  children: React.ReactNode,
}

export default function ScrollResize({
  scrollContainer,
  min = undefined,
  max = undefined,
  children,
}: ScrollResizeProps) {
  const _scrollContainer = React.useRef<HTMLDivElement | Window | undefined>(scrollContainer?.current);

  React.useEffect(
    () => void (_scrollContainer.current ||= window),
    []
  );

  const container = useRef<HTMLDivElement>(null);
  const spacer = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [spacerHeight, setSpacerHeight] = useState<string | number>("0%");
  const [contentHeight, setContentHeight] = useState<string | number>("100%");

  const handleScroll = useCallback(
    (e: Event) => {
      const { currentTarget } = e;

      // Math.max ensures negative scroll value is not possible (scroll bounce may cause negative values)
      const scrollTop = Math.max(
        0,
        currentTarget instanceof Window
          ? currentTarget.scrollY
          : currentTarget instanceof HTMLDivElement
          ? currentTarget.scrollTop
          : 0
      );
      const containerHeight = container.current?.clientHeight || 0;

      setContentHeight(Math.max(0, containerHeight - scrollTop));
      setSpacerHeight(scrollTop);
    },
    []
  );

  useEffect(
    function addScrollListener() {
      const { current } = _scrollContainer;
      if (!current) return;
      const handler = throttle(handleScroll, 10, { trailing: true });
      current.addEventListener("scroll", handler);
      return () => current.removeEventListener("scroll", handler);
    },
    [_scrollContainer, handleScroll]
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