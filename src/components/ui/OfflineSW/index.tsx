"use client";

import { useEffect } from "react";


async function registerSW() {
  await navigator.serviceWorker.register(
    "/offline-sw.js",
    {
      scope: "/",
      updateViaCache: "none",
    },
  );
}

export default function OfflineSW() {
  useEffect(
    () => {
      if ("serviceWorker" in navigator) registerSW();
    },
    []
  );

  return null;
}