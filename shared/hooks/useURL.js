
import { useRouter } from "next/router.js";
import { useEffect, useState } from "react";

export default function useURL() {
  const router = useRouter();
  const isReady = router.isReady;

  const [host, setHost] = useState(null);
  const [url, setUrl] = useState(null);

  // Handle changes to the hostname
  const handleHostnameChange = () => {
    const { protocol, host } = window.location;
    if (protocol && host) setHost(`${protocol}//${host}`);
  };

  // Get hostname on first render
  useEffect(
    () => {
      handleHostnameChange();
    },
    []
  );

  // Watch for chagnes to the hostname
  useEffect(
    () => {
      router.events.on("routeChangeComplete", handleHostnameChange);
      return () => {
        router.events.off("routeChangeComplete", handleHostnameChange);
      };
    },
    [router.events]
  );

  // Watch for changes to the url
  useEffect(
    () => {
      if (!host || !isReady) return;

      const freshUrl = new URL(router.asPath, host);
      setUrl(freshUrl);
    },
    [router.asPath, host, isReady]
  );

  // Handle changing the url
  const handleSetUrl = (url, method, { as, ...options } = {}) => {
    const func = (method === "push") ? router.push : router.replace;
    const encodedUrl = url.toString();

    func(encodedUrl, as, options);
  }

  return [url, handleSetUrl];
}
