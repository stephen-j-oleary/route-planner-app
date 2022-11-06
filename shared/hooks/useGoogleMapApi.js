
import _ from "lodash";
import { useEffect, useMemo, useState } from "react";

export default function useGoogleMapApi() {
  const [resolve, setResolve] = useState(() => _.noop);

  // Create a promise and store the resolve function in react state
  const promise = useMemo(
    () => new Promise((res, rej) => {
      setResolve(() => res);
    }),
    []
  );

  // Create global callback that calls resolve when script is loaded
  useEffect(
    () => {
      window.ready = () => resolve(window.google);
      return () => {
        delete window.ready;
      }
    },
    [resolve]
  );

  useEffect(() => {
    if (document.getElementById("gm_script")) return;

    const tag = document.createElement("script");
    tag.id = "gm_script";
    tag.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&callback=ready&libraries=geometry`;
    tag.defer = true;
    document.body.appendChild(tag);
  });

  return promise;
}
