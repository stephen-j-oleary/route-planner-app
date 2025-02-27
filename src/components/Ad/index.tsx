"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

import { Box, BoxProps } from "@mui/material";


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
      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6577552601434432"
        strategy="afterInteractive"
        async
        crossOrigin="anonymous"
        onLoad={() => setIsScriptLoaded(true)}
      />

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