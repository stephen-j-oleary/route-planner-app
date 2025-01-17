"use client";

import { HTMLAttributes, useEffect, useState } from "react";

import useScript from "@/hooks/useScript";


declare global {
  interface Window {
    adsbygoogle: object[];
  }
}

export type AdProps = {
  adSlot: string,
  style?: HTMLAttributes<HTMLElement>["style"],
};

export default function Ad({
  adSlot,
  style,
}: AdProps) {
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
    <ins
      className="adsbygoogle"
      style={{
        display: "block",
        ...style,
      }}
      data-ad-client="ca-pub-6577552601434432"
      data-ad-slot={adSlot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}