"use client";

import Script from "next/script";

import { useConsent } from "@/components/ui/CookieConsent/hooks";


export default function Analytics() {
  const consent = useConsent();
  const hasAnalyticsConsent = consent?.includes("analytics") ?? false;

  if (!hasAnalyticsConsent) return;

  const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_MEASUREMENT_ID;
  if (!analyticsId) return;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
      />
      <Script
        id="googleAnalytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag() {
              dataLayer.push(arguments);
            }

            // Default consent
            gtag(
              "consent",
              "default",
              {
                ad_personalization: "denied",
                ad_storage: "denied",
                ad_user_data: "denied",
                analytics_storage: "denied",
                functionality_storage: "denied",
                personalization_storage: "denied",
                security_storage: "granted",
                wait_for_update: 500,
              }
            );
            gtag("set", "ads_data_redaction", true);
            gtag("set", "url_passthrough", false);
            // End default consent

            gtag("js", new Date());

            gtag("config", "${analyticsId}");
          `
        }}
      />
    </>
  );
}