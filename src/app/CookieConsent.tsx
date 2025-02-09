import Script from "next/script";

export default function CookieConsent() {
  return (
    <>
      <Script
        async
        type="text/javascript"
        strategy="afterInteractive"
        src="https://consent.cookiebot.com/uc.js"
        id="Cookiebot"
        data-cbid="4b6b1847-891e-4016-a9ff-2aeadd8941dd"
      />

      <Script
        strategy="afterInteractive"
        data-cookieconsent="ignore"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag() {
              dataLayer.push(arguments);
            }
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
          `,
        }}
      />
    </>
  );
}