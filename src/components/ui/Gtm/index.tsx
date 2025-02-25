"use client";

import Script from "next/script";
import { useEffect } from "react";

import { sendGTMEvent } from "./actions";
import { useConsent } from "@/components/ui/CookieConsent/hooks";


const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_MEASUREMENT_ID ?? "";

export { default as Analytics } from "./Analytics";

export default function Gtm() {
  const { consent } = useConsent();


  useEffect(
    () => {
      sendGTMEvent(
        "consent",
        "default",
        {
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
          analytics_storage: "denied",
        },
      );
    },
    []
  );

  useEffect(
    () => {
      sendGTMEvent(
        "consent",
        "update",
        {
          ad_storage: consent?.includes("ads") ? "granted" : "denied",
          ad_user_data: consent?.includes("ads") ? "granted" : "denied",
          ad_personalization: consent?.includes("ads") ? "granted" : "denied",
          analytics_storage: consent?.includes("analytics") ? "granted" : "denied",
        },
      );
    },
    [consent]
  );

  return (
    <Script
      data-ntpc="GTM"
      strategy="afterInteractive"
      src={`https://www.googletagmanager.com/gtm.js?id=${analyticsId}`}
    />
  );
}