import { useEffect } from "react";


export default function useScript(src, props) {
  useEffect(
    () => {
      const script = document.createElement("script");

      script.src = src;
      for (const key in props) {
        const prop = props[key];
        script[key] = prop;
      }

      document.body.insertBefore(script, document.body.firstChild);

      return () => document.body.removeChild(script);
    },
    [src, props]
  );
}