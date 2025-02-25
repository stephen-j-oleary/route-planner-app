"use client";

import Script from "next/script";
import { useEffect } from "react";

import { sendGTMEvent } from "@/components/ui/Gtm/actions";


const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_MEASUREMENT_ID ?? "";

export default function Analytics() {

  useEffect(
    () => {
      sendGTMEvent("js", new Date());

      sendGTMEvent("config", analyticsId);
    },
    []
  );

  return (
    <Script
      strategy="afterInteractive"
      src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
    />
  );
}