import Script from "next/script";

export default function CookieConsent() {
  return (
    <Script
      async
      type="text/javascript"
      strategy="afterInteractive"
      src="https://consent.cookiebot.com/uc.js"
      id="Cookiebot"
      data-cbid="4b6b1847-891e-4016-a9ff-2aeadd8941dd"
    />
  );
}