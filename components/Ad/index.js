import { useEffect, useId, useState } from "react";

import useScript from "@/shared/hooks/useScript";


export default function Ad({ slot }) {
  const id = useId();
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
      style={{ display: "block" }}
      data-ad-client="ca-pub-6577552601434432"
      data-ad-slot={slot || id}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}