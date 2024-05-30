import "client-only";

import React from "react";


export type UseScriptProps = {
  async?: boolean,
  crossOrigin?: string,
  onLoad?: () => void,
}

export default function useScript(src: string, props: UseScriptProps) {
  React.useEffect(
    () => {
      const { async, crossOrigin, onLoad } = props;

      const script = document.createElement("script");

      script.src = src;
      if (async) script.async = async;
      if (crossOrigin) script.crossOrigin = crossOrigin;
      if (onLoad) script.onload = onLoad;

      document.body.insertBefore(script, document.body.firstChild);

      return () => void document.body.removeChild(script);
    },
    [src, props]
  );
}