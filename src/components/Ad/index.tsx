"use client";

import { useEffect, useState } from "react";

import { Box, BoxProps } from "@mui/material";

import useScript from "@/hooks/useScript";


declare global {
  interface Window {
    adsbygoogle: object[];
  }
}

export type AdProps =
  & BoxProps
  & { adSlot: string };

export default function Ad({
  adSlot,
  ...props
}: AdProps) {
  return null;

  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useScript(
    "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6577552601434432",
    {
      async: true,
      crossOrigin: "anonymous",
      onLoad: () => setIsScriptLoaded(true),
    }
  );

  useEffect(
    () => {
      if (!isScriptLoaded) return;
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    },
    [isScriptLoaded]
  );

  return (
    <Box
      display="block"
      {...props}
    >
      <ins
        className="adsbygoogle"
        data-ad-client="ca-pub-6577552601434432"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </Box>
  );
}